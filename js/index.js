const ckbaj = document.getElementById('ckbaj');
const ckbdc = document.getElementById('ckbdc');
const visibleDiv = localStorage.getItem('visibleDiv') || 'jailbreak-page';
const savedaj = localStorage.getItem('autojbstate');
const savedc = localStorage.getItem('dbugc');
const menuBtns = document.querySelectorAll('.menu-btn');
const psBtns = document.querySelectorAll('.ps-btn');
const plsbtn = document.querySelectorAll('.button-container button');
const consoleDev = document.getElementById("console");

var ps4fw

window.addEventListener('DOMContentLoaded', loadsettings);

document.getElementById('jailbreak').addEventListener('click', () => {
  jailbreak();
});

document.getElementById('binloader').addEventListener('click', () => {
  binloader();
});

document.querySelectorAll('button[data-func]').forEach(button => {
  button.addEventListener('click', () => {
    const payload = button.getAttribute('data-func');
    Loadpayloads(payload);
  });
});

document.getElementById('generate-cache-btn').addEventListener('click', () => {
  fetch('/generate_manifest', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
    })
    .catch(error => {
      alert('Error: ' + error + '\nEsta opción solo funciona en servidor local.\nAsegúrate de que el servidor esté activo.');
    });
});

document.getElementById('update-exploit').addEventListener('click', () => {
  fetch('/update_exploit', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('console').textContent = data.results.join('\n') + '\nNo olvides actualizar el caché.';
    })
    .catch(err => {
      alert('Error: ' + err + '\nEsta opción solo funciona en servidor local.\nAsegúrate de que el servidor esté activo.');
    });
});

ckbaj.addEventListener('change', (e) => {
  localStorage.setItem('autojbstate', e.target.checked);
  onCheckboxChange(e.target.checked);
});

ckbdc.addEventListener('change', (e) => {
  localStorage.setItem('dbugc', e.target.checked);
  onCheckboxChange(e.target.checked);
  if (ckbdc.checked) {
    document.getElementById('DebugConsole').style.display  = 'flex';
  } else {
    document.getElementById('DebugConsole').style.display = 'none';
  }
});

function isHttps() {
  return window.location.protocol === 'https:';
}

async function loadMultipleModules(files) {
  try {
    const modules = await Promise.all(files.map(file => import(file)));
    return modules;
  } catch (error) {
    console.error("Error cargando módulos:", error);
    throw error;
  }
}

function showabout() {
  document.getElementById('about-popup').style.display = 'flex';
  document.getElementById('overlay-popup').style.display = 'block';
}

function closeabout() {
  document.getElementById('about-popup').style.display = 'none';
  document.getElementById('overlay-popup').style.display = 'none';
}

function showsettings() {
  document.getElementById('settings-popup').style.display = 'flex';
  document.getElementById('overlay-popup').style.display = 'block';
}

function closesettings() {
  document.getElementById('settings-popup').style.display = 'none';
  document.getElementById('overlay-popup').style.display = 'none';
}

function CheckFW() {
  const userAgent = navigator.userAgent;
  const ps4Regex = /PlayStation(?:;\s*PlayStation)?(?: 4\/| 4 )?(\d+\.\d+)/;
  const elementsToHide = [
    'jailbreak-page', 'jailbreak', 'autojbchkb', 'agtext',
    'payloadsbtn', 'generate-cache-btn', 'update-exploit', 'settings-btn'
  ];
  
  if (ps4Regex.test(userAgent)) {
    const match = userAgent.match(ps4Regex);
    const fwVersion = match ? match[1] : "Desconocido";

    if (
      fwVersion === '9.00' || fwVersion === '9.03' || fwVersion === '9.60' ||
      fwVersion === '7.00' || fwVersion === '7.01' || fwVersion === '7.02' ||
      fwVersion === '7.50' || fwVersion === '7.51' || fwVersion === '7.55' ||
      fwVersion === '8.00' || fwVersion === '8.01' || fwVersion === '8.03' ||
      fwVersion === '8.50' || fwVersion === '8.52' || fwVersion === '9.04' ||
      fwVersion === '9.50' || fwVersion === '9.51'
    ) {
      document.getElementById('PS4FW').textContent = `PS4 FW: ${fwVersion} | Compatible`;
      document.getElementById('PS4FW').style.color = '#00ff00';
      ps4fw = fwVersion.replace('.', '');
      document.getElementById('install-psfrf').style.display = 'flex';
      if (ps4fw === '903' || ps4fw === '960') {
        document.getElementById('gameb').style.display = 'none';
      }
      if (ps4fw === '900' || ps4fw === '903' || ps4fw === '960'){
        document.getElementById('linuxb').style.display = 'flex';
      }
    } else {
      document.getElementById('PS4FW').textContent = `PS4 FW: ${fwVersion || 'Desconocido'} | Incompatible`;
      document.getElementById('PS4FW').style.color = '#ff0000';

      elementsToHide.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
    }

    document.title = "PSFree | " + fwVersion;
  } else {
    let platform = 'Plataforma desconocida';

    if (/Android/.test(userAgent)) platform = 'Android';
    else if (/iPhone|iPad|iPod/.test(userAgent)) platform = 'iOS';
    else if (/Macintosh/.test(userAgent)) platform = 'MacOS';
    else if (/Windows/.test(userAgent)) platform = 'Windows';
    else if (/Linux/.test(userAgent)) platform = 'Linux';

    document.getElementById('PS4FW').textContent = `Modo PC - Simulación (${platform})`;
    document.getElementById('PS4FW').style.color = '#ffa500';

    elementsToHide.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });

    const jbBtn = document.getElementById('jailbreak');
    if (jbBtn) jbBtn.style.display = 'flex';

    const ps4fwEl = document.getElementById('PS4FW');
    if (ps4fwEl) ps4fwEl.style.display = 'flex';

    ps4fw = '900';
  }
}

function checksettings() {
  if (localStorage.getItem('HEN')) {
    menuBtns.forEach(el => {
      el.onmouseover = () => el.style.backgroundColor = '#00F0FF';
      el.onmouseout = () => el.style.backgroundColor = '';
    });

    psBtns.forEach(el => {
      el.onmouseover = () => {
      el.style.boxShadow = '0 0px 48px #00F0FF, 0 0px 10px #000c';
        const svg = el.querySelector('svg');
        if (svg) svg.style.fill = '#00F0FF';
      };
      el.onmouseout = () => {
        el.style.boxShadow = '';
        const svg = el.querySelector('svg');
        if (svg) svg.style.fill = '';
      };
    });

    plsbtn.forEach(btn => {
      btn.style.borderColor = '#00F0FF';
      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#00F0FF';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = ''; 
      });
    });

    document.getElementById('console').style.borderColor = '#00F0FF';
    document.getElementById('header-title').style.borderColor = '#00F0FF';
    document.getElementById('header-title').style.textShadow = '0px 0px 15px #00F0FF';
    
    const containers = document.querySelectorAll('.button-container');
    containers.forEach(container => {
      container.style.borderColor = '#00F0FF';
    });
  } else {
    menuBtns.forEach(el => {
      el.onmouseover = () => el.style.backgroundColor = '#FFB84D';
      el.onmouseout = () => el.style.backgroundColor = '';
    });

    psBtns.forEach(el => {
      el.onmouseover = () => {
        el.style.boxShadow = '0 0px 48px #FFB84D, 0 0px 10px #000c';
        const svg = el.querySelector('svg');
        if (svg) svg.style.fill = '#FFB84D';
      };
      el.onmouseout = () => {
        el.style.boxShadow = '';
        const svg = el.querySelector('svg');
        if (svg) svg.style.fill = '';
      };
    });

    plsbtn.forEach(btn => {
      btn.style.borderColor = '#FFB84D';
      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#FFB84D';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = '';
      });
    });

    document.getElementById('console').style.borderColor = '#FFB84D';
    document.getElementById('header-title').style.borderColor = '#FFB84D';
    document.getElementById('header-title').style.textShadow = '0px 0px 15px #FFB84D';
    document.getElementById('button-container').style.borderColor = '#FFB84D';

    const containers = document.querySelectorAll('.button-container');
    containers.forEach(container => {
      container.style.borderColor = '#FFB84D';
    });
  }
}

function choosejb(hen) {
  if (hen === 'HEN') {
    localStorage.removeItem('GoldHEN');
    localStorage.setItem('HEN', 1);
  } else if (hen === 'GoldHEN') {
    localStorage.removeItem('HEN');
    localStorage.setItem('GoldHEN', 1);
  }
  checksettings();
}

function showpayloads() {
  if (document.getElementById('payloadsbtn').textContent == 'Payloads') {
  document.getElementById('jailbreak-page').style.display = 'none';
  document.getElementById('PS4FW').style.display = 'none';
  document.getElementById('payloads-page').style.display = 'block';
  document.getElementById('payloadsbtn').textContent = 'Jailbreak';
  localStorage.setItem('visibleDiv', 'payloads-page');
  }else{
  document.getElementById('jailbreak-page').style.display = 'block';
  document.getElementById('PS4FW').style.display = 'flex';
  document.getElementById('payloads-page').style.display = 'none';
  document.getElementById('payloadsbtn').textContent = 'Payloads';
  localStorage.setItem('visibleDiv', 'jailbreak-page');

  };
  CheckFW();
}

function showtoolspayloads() {
  document.getElementById('payloads-linux').style.display = 'none';
  document.getElementById('payloads-game').style.display = 'none';
  document.getElementById('payloads-tools').style.display = 'block';
}

function showgamepayloads() {
  document.getElementById('payloads-linux').style.display = 'none';
  document.getElementById('payloads-game').style.display = 'block';
  document.getElementById('payloads-tools').style.display = 'none';
}

function showlinuxpayloads() {
  document.getElementById('payloads-linux').style.display = 'block';
  document.getElementById('payloads-game').style.display = 'none';
  document.getElementById('payloads-tools').style.display = 'none';
}

function loadjbflavor() {
  const savedValue = localStorage.getItem('selectedHEN');
  if (savedValue) {
    const radio = document.querySelector(`input[name="hen"][value="${savedValue}"]`);
    if (radio) {
      radio.checked = true;
    }
  }
}

function savejbflavor() {
  const radios = document.querySelectorAll('input[name="hen"]');
  radios.forEach(radio => {
    if (radio.checked) {
      localStorage.setItem('selectedHEN', radio.value);
    }
  });
}

function loadajbsettings(){
  if (savedaj !== null) {
    ckbaj.checked = savedaj === 'true';
    onCheckboxChange(ckbaj.checked);
  }

  if (savedc !== null){
    ckbdc.checked = savedc === 'true';
    onCheckboxChange(ckbdc.checked);
  }

  if (ckbaj.checked) {
    if (sessionStorage.getItem('jbsuccess')) {
      consoleDev.append('¡Ya está jailbreakeado!\n');
      consoleDev.scrollTop = consoleDev.scrollHeight;
    } else {
      document.getElementById('jailbreak').style.display = 'none';
      consoleDev.append('Jailbreak automático en progreso... Espera unos segundos.\n');
      consoleDev.scrollTop = consoleDev.scrollHeight;
      setTimeout(() => {
        jailbreak();
      }, 3000);
    }
  }

  if (ckbdc.checked) {
    document.getElementById('DebugConsole').style.display  = 'flex';
  } else {
    document.getElementById('DebugConsole').style.display = 'none';
  }

  if (isHttps()) {
    const btn1 = document.getElementById('generate-cache-btn');
    const btn2 = document.getElementById('update-exploit');
    if (btn1) btn1.style.display = 'none';
    if (btn2) btn2.style.display = 'none';
  }

  if (visibleDiv === 'jailbreak-page') {
    document.getElementById('jailbreak-page').style.display = 'block';
    document.getElementById('PS4FW').style.display = 'flex';
    document.getElementById('payloads-page').style.display = 'none';
    document.getElementById('payloadsbtn').textContent = 'Payloads';
  } else {
    document.getElementById('jailbreak-page').style.display = 'none';
    document.getElementById('PS4FW').style.display = 'none';
    document.getElementById('payloads-page').style.display = 'block';
    document.getElementById('payloadsbtn').textContent = 'Jailbreak';
    localStorage.setItem('visibleDiv', 'payloads-page');
  }
}

async function jailbreak() {
  try {
    if (sessionStorage.getItem('jbsuccess')) {
      consoleDev.append('¡Ya está jailbreakeado!\n');
      consoleDev.scrollTop = consoleDev.scrollHeight;
    } else {
      document.getElementById('jailbreak').style.display = 'none';
      const modules = await loadMultipleModules([
        '../payloads/Jailbreak.js',
        '../psfree/alert.mjs'
      ]);
      console.log("Todos los módulos están cargados.");
      const JailbreakModule = modules[0];

      if (localStorage.getItem('HEN')) {
        if (JailbreakModule && typeof JailbreakModule.HEN === 'function') {
            JailbreakModule.HEN();
        } else {
            console.error("Función HEN no encontrada en Jailbreak.js");
        }
      } else if (localStorage.getItem('GoldHEN')) {
        if (JailbreakModule && typeof JailbreakModule.GoldHEN === 'function') {
            JailbreakModule.GoldHEN();
        } else {
            console.error("Función GoldHEN no encontrada en Jailbreak.js");
        }
      } else {
        if (JailbreakModule && typeof JailbreakModule.GoldHEN === 'function') {
            JailbreakModule.GoldHEN();
        } else {
            console.error("Función GoldHEN no encontrada en Jailbreak.js");
        }
      }
    }
  } catch (e) {
    console.error("Error en jailbreak:", e);
  }
}

async function binloader() {
  try {
    sessionStorage.setItem('binloader', 1);
    const modules = await loadMultipleModules([
      '../psfree/alert.mjs'
    ]);
    console.log("Todos los módulos están cargados.");

    const goldhenModule = modules[0];
    if (goldhenModule && typeof goldhenModule.runBinLoader === 'function') {
      goldhenModule.runBinLoader();
    } else {
      console.error("Función GoldHEN no encontrada en GoldHEN.js");
    }
  } catch (e) {
    console.error("Error en binloader:", e);
  }
}

async function Loadpayloads(payload) {
  try {
    let modules;
    sessionStorage.removeItem('binloader');
    if (isHttps()) {
      modules = await loadMultipleModules([
        '../payloads/payloads.js',
        '../psfree/alert.mjs'
      ]);
      console.log("Todos los módulos están cargados.");
    } else {
      modules = await loadMultipleModules([
        '../payloads/payloads.js'
      ]);
      console.log("Todos los módulos están cargados.");
    }

    const payloadModule = modules[0];
    if (payloadModule && typeof payloadModule[payload] === 'function') {
      payloadModule[payload]();
    } else {
      console.error(`Función ${payload} no encontrada en payloads.js`);
    }
  } catch (e) {
    console.error(`Error cargando ${payload}:`, e);
  }
}

function loadsettings() {
  CheckFW();
  loadajbsettings();
  loadjbflavor();
  checksettings();
}

function onCheckboxChange(checked) {
  if (checked) {
    console.log('Checkbox activado.');
  } else {
    console.log('Checkbox desactivado.');
  }
}