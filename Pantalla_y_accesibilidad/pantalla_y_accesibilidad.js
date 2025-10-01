// Controles
const root = document.documentElement; // <html>
const body = document.body;            // <body>
const brightness = document.getElementById('brightness');
const brightnessVal = document.getElementById('brightnessVal');
const themeToggle = document.getElementById('themeToggle');
const textSize = document.getElementById('textSize');
const textSizeVal = document.getElementById('textSizeVal');
const lineHeight = document.getElementById('lineHeight');
const highContrast = document.getElementById('highContrast');
const preview = document.getElementById('preview');

// --- Aplicar configuración guardada en todas las páginas ---
window.addEventListener('DOMContentLoaded', () => {
    // Brillo
    const savedBrightness = localStorage.getItem('brightness');
    if (savedBrightness) {
        root.style.filter = `brightness(${savedBrightness}%)`;
        if (brightness) {
            brightness.value = savedBrightness;
            brightnessVal.textContent = savedBrightness + '%';
        }
    }

    // Tamaño de texto
    const savedTextSize = localStorage.getItem('textSize');
    if (savedTextSize) {
        root.style.fontSize = savedTextSize + 'px';
        if (textSize) {
            textSize.value = savedTextSize;
            textSizeVal.textContent = savedTextSize + 'px';
        }
    }

    // Interlineado
    const savedLineHeight = localStorage.getItem('lineHeight');
    if (savedLineHeight) {
        body.style.lineHeight = savedLineHeight;   // ahora sí funciona
        if (lineHeight) lineHeight.value = savedLineHeight;
    }


    // Tema oscuro
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme === 'dark' ? 'dark' : '');
        if (themeToggle) {
            themeToggle.setAttribute('aria-checked', savedTheme === 'dark');
        }
    }

    // Alto contraste
    const savedContrast = localStorage.getItem('contrast');
    if (savedContrast === 'on') {
        root.classList.add('high-contrast');
        if (preview) {
            preview.style.background = '#000000';
            preview.style.color = '#ffffff';
        }
        if (highContrast) {
            highContrast.setAttribute('aria-checked', 'true');
        }
    }
});

// --- Guardar cambios ---
if (brightness) {
    brightness.addEventListener('input', () => {
        const v = brightness.value;
        root.style.filter = `brightness(${v}%)`;
        brightnessVal.textContent = v + '%';
        localStorage.setItem('brightness', v);
    });
}

if (textSize) {
    textSize.addEventListener('input', () => {
        const v = textSize.value;
        root.style.fontSize = v + 'px';
        textSizeVal.textContent = v + 'px';
        localStorage.setItem('textSize', v);
    });
}

if (lineHeight) {
    lineHeight.addEventListener('input', () => {
        const v = lineHeight.value;
        body.style.lineHeight = v;
        localStorage.setItem('lineHeight', v);
    });
}

if (themeToggle) {
    function toggleSwitch(el) {
        const is = el.getAttribute('aria-checked') === 'true';
        el.setAttribute('aria-checked', String(!is));
        el.dispatchEvent(new Event('change'));
    }

    themeToggle.addEventListener('click', () => toggleSwitch(themeToggle));
    themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSwitch(themeToggle);
        }
    });
    themeToggle.addEventListener('change', () => {
        const on = themeToggle.getAttribute('aria-checked') === 'true';
        root.setAttribute('data-theme', on ? 'dark' : '');
        localStorage.setItem('theme', on ? 'dark' : 'light');
    });
}

if (highContrast) {
    function toggleSwitch(el) {
        const is = el.getAttribute('aria-checked') === 'true';
        el.setAttribute('aria-checked', String(!is));
        el.dispatchEvent(new Event('change'));
    }

    highContrast.addEventListener('click', () => toggleSwitch(highContrast));
    highContrast.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSwitch(highContrast);
        }
    });
    highContrast.addEventListener('change', () => {
        const on = highContrast.getAttribute('aria-checked') === 'true';
        if (on) {
            root.classList.add('high-contrast');
            if (preview) {
                preview.style.background = '#000';
                preview.style.color = '#fff';
            }
            localStorage.setItem('contrast', 'on');
        } else {
            root.classList.remove('high-contrast');
            if (preview) {
                preview.style.background = '';
                preview.style.color = '';
            }
            localStorage.setItem('contrast', 'off');
        }
    });
}

