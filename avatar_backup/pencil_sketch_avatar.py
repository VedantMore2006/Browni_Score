import cv2
import numpy as np
import os
import argparse
from pathlib import Path


def generate_paper_texture(height: int, width: int, texture_type: str = 'fine') -> np.ndarray:
    """
    Generates a realistic paper grain texture procedurally.
    """
    np.random.seed(42)  # Deterministic seed for reproducible grain
    if texture_type == 'coarse':
        base_noise = np.random.normal(240, 10, (height // 2, width // 2)).astype(np.float32)
        base_noise = cv2.resize(base_noise, (width, height), interpolation=cv2.INTER_CUBIC)
        micro_noise = np.random.normal(0, 4, (height, width)).astype(np.float32)
        paper = np.clip(base_noise + micro_noise, 0, 255)
    else:
        # Fine graphite paper grain
        noise = np.random.normal(246, 5, (height, width)).astype(np.float32)
        paper = cv2.GaussianBlur(noise, (3, 3), 0)
    return np.clip(paper, 0, 255).astype(np.uint8)


def pencil_avatar(
    input_path: str,
    output_path: str = None,
    style: str = "graphite",
    target_size: tuple = (1024, 1024),
    preserve_aspect_ratio: bool = True,
    shade_intensity: float = 0.85,
    line_sharpness: float = 0.75,
    paper_texture: bool = True
) -> str:
    """
    Master Pencil Sketch Avatar Converter.
    
    Parameters:
    -----------
    input_path : str
        Path to the input image file.
    output_path : str, optional
        Path where the pencil sketch avatar will be saved.
    style : str
        Style variant: 'graphite' (default), 'charcoal', 'color_pencil', 'vintage_sepia'.
    target_size : tuple
        Maximum target resolution (width, height).
    preserve_aspect_ratio : bool
        If True, maintains image aspect ratio within target_size bounds.
    shade_intensity : float
        Intensity scaling for graphite shading.
    line_sharpness : float
        Sharpness multiplier for pencil contour line art.
    paper_texture : bool
        Whether to blend physical paper grain texture into the output.
        
    Returns:
    --------
    str
        Path to the saved avatar image.
    """
    input_file = Path(input_path)
    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")
        
    img = cv2.imread(str(input_file))
    if img is None:
        raise ValueError(f"Could not decode image at {input_path}")
        
    h_orig, w_orig = img.shape[:2]
    
    # ---------------------------------------------------------
    # 1. High-Quality Image Resizing
    # ---------------------------------------------------------
    if target_size:
        if preserve_aspect_ratio:
            scale = min(target_size[0] / w_orig, target_size[1] / h_orig)
            new_w, new_h = max(1, int(w_orig * scale)), max(1, int(h_orig * scale))
            img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
        else:
            img = cv2.resize(img, target_size, interpolation=cv2.INTER_LANCZOS4)
            
    h, w = img.shape[:2]
    
    # ---------------------------------------------------------
    # 2. Rendering Style Branch
    # ---------------------------------------------------------
    if style == "color_pencil":
        # OpenCV built-in color pencil sketch + paper texture enhancement
        dst_gray, dst_color = cv2.pencilSketch(
            img, 
            sigma_s=50, 
            sigma_r=0.07, 
            shade_factor=0.04
        )
        # Boost saturation for a rich colored-pencil aesthetic
        hsv = cv2.cvtColor(dst_color, cv2.COLOR_BGR2HSV).astype(np.float32)
        hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.25, 0, 255)
        hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 1.05, 0, 255)
        result = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
        
        if paper_texture:
            paper = generate_paper_texture(h, w, 'fine')
            paper_3ch = cv2.cvtColor(paper, cv2.COLOR_GRAY2BGR)
            result = cv2.multiply(result.astype(np.float32) / 255.0, paper_3ch.astype(np.float32) / 255.0) * 255.0
            result = np.clip(result, 0, 255).astype(np.uint8)
            
    else:
        # Grayscale Base & Edge-Preserving Pre-Filter
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Edge-preserving filter smooths skin texture while keeping eye/nose/lip lines intact
        smooth = cv2.edgePreservingFilter(img, flags=1, sigma_s=35, sigma_r=0.25)
        smooth_gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)
        
        # ---------------------------------------------------------
        # 3. Graphite Shading Layer (Inverted Gaussian Dodge)
        # ---------------------------------------------------------
        inverted = 255 - smooth_gray
        sigma_val = 18 if style != "charcoal" else 28
        blur = cv2.GaussianBlur(inverted, (0, 0), sigmaX=sigma_val)
        dodge = cv2.divide(smooth_gray, np.maximum(255 - blur, 1), scale=256)
        
        # Gamma tone curve adjustment (prevents blown-out whites on forehead/cheeks)
        gamma = 1.15 if style == "graphite" else 0.95
        dodge_curve = np.power(dodge / 255.0, gamma) * 255.0
        dodge_curve = np.clip(dodge_curve, 0, 255).astype(np.uint8)
        
        # ---------------------------------------------------------
        # 4. Multi-Scale Line Extraction (Difference of Gaussians)
        # ---------------------------------------------------------
        # Fine HB pencil lines
        g_fine1 = cv2.GaussianBlur(gray, (3, 3), 0)
        g_fine2 = cv2.GaussianBlur(gray, (7, 7), 0)
        dog_fine = cv2.subtract(g_fine2, g_fine1)
        _, lines_fine = cv2.threshold(dog_fine, 4, 255, cv2.THRESH_BINARY)
        lines_fine = 255 - lines_fine
        
        # Bold 4B/6B accent lines
        g_bold1 = cv2.GaussianBlur(gray, (5, 5), 0)
        g_bold2 = cv2.GaussianBlur(gray, (15, 15), 0)
        dog_bold = cv2.subtract(g_bold2, g_bold1)
        _, lines_bold = cv2.threshold(dog_bold, 8, 255, cv2.THRESH_BINARY)
        lines_bold = 255 - lines_bold
        
        # Combine line weights
        lines_combined = cv2.addWeighted(lines_fine, 0.65, lines_bold, 0.35, 0)
        lines_softened = cv2.GaussianBlur(lines_combined, (3, 3), 0)
        
        # ---------------------------------------------------------
        # 5. Composite Shading + Pencil Line Art
        # ---------------------------------------------------------
        pencil_raw = cv2.multiply(
            dodge_curve.astype(np.float32) / 255.0,
            lines_softened.astype(np.float32) / 255.0
        ) * 255.0
        pencil_raw = np.clip(pencil_raw, 0, 255).astype(np.uint8)
        
        # CLAHE for facial expression detail (eyes, eyebrows, lips)
        clip_lim = 2.2 if style == "charcoal" else 1.6
        clahe = cv2.createCLAHE(clipLimit=clip_lim, tileGridSize=(8, 8))
        detail_enhanced = clahe.apply(pencil_raw)
        
        pencil_base = cv2.addWeighted(pencil_raw, 0.65, detail_enhanced, 0.35, 0)
        
        # ---------------------------------------------------------
        # 6. Apply Paper Grain Texture
        # ---------------------------------------------------------
        if paper_texture:
            tex_type = 'coarse' if style == "charcoal" else 'fine'
            paper = generate_paper_texture(h, w, tex_type)
            pencil_textured = cv2.multiply(
                pencil_base.astype(np.float32) / 255.0,
                paper.astype(np.float32) / 255.0
            ) * 255.0
            pencil_final = np.clip(pencil_textured, 0, 255).astype(np.uint8)
        else:
            pencil_final = pencil_base
            
        # ---------------------------------------------------------
        # 7. Final Tonal Filter & Channel Mapping
        # ---------------------------------------------------------
        if style == "vintage_sepia":
            pencil_3ch = cv2.cvtColor(pencil_final, cv2.COLOR_GRAY2BGR).astype(np.float32)
            sepia_filter = np.array([
                [0.272, 0.534, 0.131],
                [0.349, 0.686, 0.168],
                [0.393, 0.769, 0.189]
            ])
            tinted = cv2.transform(pencil_3ch, sepia_filter)
            result = np.clip(tinted, 0, 255).astype(np.uint8)
        elif style == "charcoal":
            pencil_3ch = cv2.cvtColor(pencil_final, cv2.COLOR_GRAY2BGR)
            result = cv2.convertScaleAbs(pencil_3ch, alpha=1.05, beta=-10)
        else:  # Graphite (default)
            pencil_3ch = cv2.cvtColor(pencil_final, cv2.COLOR_GRAY2BGR)
            result = cv2.convertScaleAbs(pencil_3ch, alpha=1.02, beta=2)
            
    # ---------------------------------------------------------
    # 8. Save Output Image
    # ---------------------------------------------------------
    if output_path is None:
        output_path = str(input_file.parent / f"{input_file.stem}_pencil_avatar.jpg")
        
    cv2.imwrite(output_path, result, [cv2.IMWRITE_JPEG_QUALITY, 98])
    print(f"Saved [{style}] pencil avatar → {output_path}")
    return output_path


def batch_process_directory(directory_path: str, style: str = "graphite", target_size: tuple = (1024, 1024)):
    """Processes all images in a directory into pencil avatars."""
    dir_path = Path(directory_path)
    valid_exts = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}
    image_files = [
        f for f in dir_path.iterdir() 
        if f.is_file() and f.suffix.lower() in valid_exts 
        and not f.name.endswith(("_avatar.jpg", "_avatar.png"))
        and not f.name.startswith("test_")
    ]
    
    if not image_files:
        print(f"No valid input image files found in {directory_path}")
        return
        
    print(f"Processing {len(image_files)} avatar images in batch mode...")
    for img_file in image_files:
        if not img_file.exists():
            continue
        try:
            output_name = dir_path / f"{img_file.stem}_pencil_avatar.jpg"
            pencil_avatar(str(img_file), output_path=str(output_name), style=style, target_size=target_size)
        except Exception as e:
            print(f"Skipping {img_file.name} due to error: {e}")


# =============================================================
# CLI & Execution Entry Point
# =============================================================

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Master Pencil Sketch Avatar Converter")
    parser.add_argument("--input", "-i", type=str, default="ashu.png", help="Input image file path or directory")
    parser.add_argument("--output", "-o", type=str, default=None, help="Output image file path")
    parser.add_argument("--style", "-s", type=str, default="graphite", 
                        choices=["graphite", "charcoal", "color_pencil", "vintage_sepia"],
                        help="Artistic sketch style variant")
    parser.add_argument("--size", type=int, default=1024, help="Target max resolution (default: 1024)")
    parser.add_argument("--batch", "-b", action="store_true", help="Process all images in the input directory")

    args = parser.parse_args()
    
    input_path = Path(args.input)
    
    if args.batch or input_path.is_dir():
        target_dir = input_path if input_path.is_dir() else input_path.parent
        batch_process_directory(str(target_dir), style=args.style, target_size=(args.size, args.size))
    else:
        # Default single avatar execution (maintains backwards compatibility for ashu.png -> ashu_pencil_avatar.jpg)
        default_out = args.output if args.output else "ashu_pencil_avatar.jpg"
        pencil_avatar(
            input_path=str(input_path),
            output_path=default_out,
            style=args.style,
            target_size=(args.size, args.size)
        )