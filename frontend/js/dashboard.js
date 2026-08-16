// ─── SIDEBAR COLLAPSE ─────────────────────────────────
    document.getElementById('collapseBtn').addEventListener('click', () => {
      const sb = document.getElementById('sidebar');
      const ic = document.getElementById('collapseIcon');
      sb.classList.toggle('collapsed');
      ic.innerHTML = sb.classList.contains('collapsed')
        ? '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><polyline points="14 9 17 12 14 15"/>'
        : '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><polyline points="16 15 13 12 16 9"/>';
    });

    // ─── CHART ─────────────────────────────────────────────
    const members = [
      { name: 'Riya', initials: 'RV', pts: 420, rank: 'S', color: '#9b59ff' },
      { name: 'Aarav', initials: 'AS', pts: 365, rank: 'S', color: '#00c8ff' },
      { name: 'Arjun', initials: 'AV', pts: 310, rank: 'B', color: '#f5a623' },
      { name: 'Pranav', initials: 'PP', pts: 250, rank: 'B', color: '#3a7bd5' },
      { name: 'Neha', initials: 'NK', pts: 180, rank: 'B', color: '#778899' },
      { name: 'Aniket', initials: 'AK', pts: 120, rank: 'D', color: '#cc8844' },
      { name: 'Siddhant', initials: 'SM', pts: 60, rank: 'D', color: '#556677' },
    ];

    const rankThresholds = [
      { label: 'SS', val: 450, color: '#00e5ff' },
      { label: 'S', val: 350, color: '#9b59ff' },
      { label: 'B', val: 250, color: '#f5a623' },
      { label: 'D', val: 100, color: '#778899' },
    ];

    // Custom plugin: circular initials avatars on top of bars + rank threshold lines
    const avatarPlugin = {
      id: 'avatarPlugin',
      afterDatasetsDraw(chart) {
        const { ctx, data, scales } = chart;
        const xScale = scales.x, yScale = scales.y;
        data.datasets[0].data.forEach((val, i) => {
          const x = xScale.getPixelForValue(i);
          const y = yScale.getPixelForValue(val);
          const member = members[i];
          const r = 14;
          // circle bg
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y - r - 4, r, 0, Math.PI * 2);
          ctx.fillStyle = '#0d1a2d';
          ctx.fill();
          ctx.strokeStyle = member.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
          // initials
          ctx.save();
          ctx.font = 'bold 9px Rajdhani, sans-serif';
          ctx.fillStyle = member.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(member.initials, x, y - r - 4);
          ctx.restore();
        });
      }
    };

    // Rank threshold dashed lines plugin
    const thresholdPlugin = {
      id: 'thresholdPlugin',
      beforeDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const yScale = scales.y;
        rankThresholds.forEach(t => {
          const y = yScale.getPixelForValue(t.val);
          if (y < chartArea.top || y > chartArea.bottom) return;
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.moveTo(chartArea.left, y);
          ctx.lineTo(chartArea.right, y);
          ctx.strokeStyle = t.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.5;
          ctx.stroke();
          // label on right
          ctx.globalAlpha = 1;
          ctx.font = '700 10px Orbitron, sans-serif';
          ctx.fillStyle = t.color;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.label, chartArea.right + 22, y);
          ctx.restore();
        });
      }
    };

    // Idempotent: safe even if this script block ever runs more than once
    // in the same JS realm (e.g. injected navigation in the future).
    if (!Chart.registry.plugins.get('barValueLabels')) {
      Chart.register({
        id: 'barValueLabels',
        afterDatasetsDraw(chart) {
          const { ctx, data, scales } = chart;
          const xScale = scales.x, yScale = scales.y;
          data.datasets[0].data.forEach((val, i) => {
            const x = xScale.getPixelForValue(i);
            const y = yScale.getPixelForValue(val);
            ctx.save();
            ctx.font = '700 11px Orbitron, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(val, x, y + 6);
            ctx.restore();
          });
        }
      });
    }

    let teamChart = null;

    function initTeamChart() {
      const canvas = document.getElementById('teamChart');
      const ctx = canvas.getContext('2d');

      // Prevent ghost/duplicate charts if this ever runs twice (e.g. bfcache pageshow).
      if (teamChart) {
        teamChart.destroy();
        teamChart = null;
      }

      // gradient bars
      const gradients = members.map(m => {
        const g = ctx.createLinearGradient(0, 0, 0, 220);
        g.addColorStop(0, m.color);
        g.addColorStop(1, m.color + '44');
        return g;
      });

      teamChart = new Chart(ctx, {
        type: 'bar',
        plugins: [thresholdPlugin, avatarPlugin],
        data: {
          labels: members.map(m => m.name),
          datasets: [{
            data: members.map(m => m.pts),
            backgroundColor: gradients,
            borderColor: members.map(m => m.color),
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (e, elements) => { if (elements.length > 0) { window.location.href = "hunter.html?name=" + encodeURIComponent(members[elements[0].index].name); } },
          onHover: (e, elements) => { e.native.target.style.cursor = elements.length ? "pointer" : "default"; },
          layout: { padding: { top: 30, right: 30, bottom: 0, left: 0 } },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(8,15,30,0.95)',
              borderColor: 'rgba(0,200,255,0.3)',
              borderWidth: 1,
              titleColor: '#00c8ff',
              bodyColor: '#8899aa',
              titleFont: { family: 'Orbitron', size: 11, weight: '700' },
              bodyFont: { family: 'Rajdhani', size: 12, weight: '600' },
              padding: 10,
              callbacks: {
                title: items => members[items[0].dataIndex].name,
                label: item => ` ${item.raw} pts  |  Rank ${members[item.dataIndex].rank}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: {
                color: '#8899aa',
                font: { family: 'Rajdhani', size: 12, weight: '600' },
              }
            },
            y: {
              min: 0,
              max: 500,
              grid: {
                color: 'rgba(0,200,255,0.05)',
                drawBorder: false,
              },
              border: { display: false, dash: [4, 4] },
              ticks: {
                color: '#445566',
                font: { family: 'Share Tech Mono', size: 10 },
                stepSize: 50,
              }
            }
          },
          animation: {
            duration: 1200,
            easing: 'easeOutQuart'
          }
        }
      });
    }

    initTeamChart();

    // Redraw the chart if this page is restored from the browser's
    // back/forward cache (bfcache) instead of being freshly loaded —
    // canvases aren't reliably repainted on bfcache restore otherwise.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) initTeamChart();
    });