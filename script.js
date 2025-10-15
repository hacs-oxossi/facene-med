// ======= Tema claro/escuro (automático + manual) =======
const metaTheme = document.getElementById('theme-color-meta');
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(dark) {
  if (dark) {
    document.body.classList.add('dark');
    metaTheme.setAttribute('content', '#0b1220');
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '🌙 Modo Escuro Ativo — Alternar';
  } else {
    document.body.classList.remove('dark');
    metaTheme.setAttribute('content', '#f9fafb');
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '🌞 Modo Claro Ativo — Alternar';
  }
}

const mq = window.matchMedia('(prefers-color-scheme: dark)');
const saved = localStorage.getItem('theme');
if (saved) applyTheme(saved === 'dark');
else applyTheme(mq.matches);

mq.addEventListener('change', e => {
  if (!localStorage.getItem('theme')) applyTheme(e.matches);
});
themeToggle.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark')));

// ======= Helpers =======
function byId(id) {
  return document.getElementById(id);
}

function setMsgClass(el, ok) {
  el.classList.remove('warn', 'ok');
  el.classList.add(ok ? 'ok' : 'warn');
}

// Uma unidade só é "concluída" se **todas** as suas notas estiverem preenchidas (não vazias)
function unidadeConcluida(campos) {
  return campos.every(c => c.el.value !== '' && !Number.isNaN(Number(c.el.value)));
}

// Calcula média ponderada de uma unidade (assume que está concluída)
function mediaUnidade(campos) {
  let soma = 0,
    pesos = 0;
  for (const c of campos) {
    soma += Number(c.el.value) * c.peso;
    pesos += c.peso;
  }
  return pesos ? (soma / pesos) : 0;
}

// Resumo por módulo (parcial x final)
function calcularModulo(prefix, titulo, unidadesDef) {
  const finalEl = byId(prefix + '_final');
  const msgEl = byId(prefix + '_mensagem');

  const valores = [];
  let completas = 0;
  let soma = 0;
  for (const def of unidadesDef) {
    if (unidadeConcluida(def)) {
      const v = mediaUnidade(def);
      valores.push(v);
      soma += v;
      completas++;
    } else {
      valores.push('');
    }
  }

  if (completas < 4) {
    finalEl.innerText = '';
    const mediaParcial = completas > 0 ? soma / completas : 0;
    const faltantes = 4 - completas;
    // A regra de aprovação é média 7.0 (7.0 * 4 unidades = 28 pontos)
    const faltam = Math.max(0, 28 - soma);
    if (soma >= 28) {
      setMsgClass(msgEl, true);
      msgEl.innerText = `Média parcial: ${mediaParcial.toFixed(2)} | Matematicamente aprovado ✅. Ainda restam ${faltantes} unidade(s) a lançar.`;
    } else {
      setMsgClass(msgEl, false);
      msgEl.innerText = `Média parcial: ${mediaParcial.toFixed(2)} | Faltam ${faltam.toFixed(2)} pontos para aprovação. Ainda restam ${faltantes} unidade(s) a lançar.`;
    }
  } else {
    msgEl.innerText = '';
    const mediaFinal = soma / 4;
    finalEl.innerText = `Média Final ${titulo}: ${mediaFinal.toFixed(2)}`;
  }
}

function calcular(modulo) {
  // Correção do escopo de variáveis: Obtendo os elementos do DOM explicitamente
  if (modulo === 'urgencia') {
    calcularModulo('fu', 'Urgência e Emergência', [
      [{
        el: byId('fu_u1_av1'),
        peso: 9
      }, {
        el: byId('fu_u1_tp'),
        peso: 1
      }],
      [{
        el: byId('fu_u2_av1'),
        peso: 1
      }],
      [{
        el: byId('fu_u3_ospe'),
        peso: 8
      }, {
        el: byId('fu_u3_proc'),
        peso: 2
      }],
      [{
        el: byId('fu_u4_av1'),
        peso: 5
      }, {
        el: byId('fu_u4_proc'),
        peso: 5
      }],
    ]);
  }
  if (modulo === 'processos') {
    calcularModulo('pt', 'Processos Terapêuticos I', [
      [{
        el: byId('pt_u1_av1'),
        peso: 9
      }, {
        el: byId('pt_u1_tp'),
        peso: 1
      }],
      [{
        el: byId('pt_u2_av1'),
        peso: 8
      }, {
        el: byId('pt_u2_sem'),
        peso: 2
      }],
      [{
        el: byId('pt_u3_av1'),
        peso: 8
      }, {
        el: byId('pt_u3_sem'),
        peso: 2
      }],
      [{
        el: byId('pt_u4_av1'),
        peso: 5
      }, {
        el: byId('pt_u4_proc'),
        peso: 5
      }],
    ]);
  }
  if (modulo === 'semiologia') {
    calcularModulo('sm', 'Semiologia Médica dos Sistemas I', [
      [{
        el: byId('sm_u1_av1'),
        peso: 7
      }, {
        el: byId('sm_u1_sem'),
        peso: 2
      }, {
        el: byId('sm_u1_tp'),
        peso: 1
      }],
      [{
        el: byId('sm_u2_av1'),
        peso: 7
      }, {
        el: byId('sm_u2_prat'),
        peso: 3
      }],
      [{
        el: byId('sm_u3_av1'),
        peso: 7
      }, {
        el: byId('sm_u3_prat'),
        peso: 1
      }, {
        el: byId('sm_u3_sem'),
        peso: 2
      }],
      [{
        el: byId('sm_u4_av1'),
        peso: 5
      }, {
        el: byId('sm_u4_osce'),
        peso: 5
      }],
    ]);
  }
}

function limparModulo(moduloId) {
  const sec = document.getElementById(moduloId);
  sec.querySelectorAll('input[type="number"]').forEach(i => i.value = '');
  const prefix = moduloId === 'urgencia' ? 'fu' : (moduloId === 'processos' ? 'pt' : 'sm');
  byId(prefix + '_final').innerText = '';
  const m = byId(prefix + '_mensagem');
  m.innerText = '';
  m.classList.remove('ok');
  m.classList.add('warn');
}

// ======= Sincronização automática =======
function syncByClass(cls) {
  document.querySelectorAll('.' + cls).forEach(el => {
    el.addEventListener('input', e => {
      const val = e.target.value;
      document.querySelectorAll('.' + cls).forEach(i => {
        if (i !== e.target) i.value = val;
      });
    });
  });
}
syncByClass('avaliacao-integrada');
syncByClass('teste-progresso');
