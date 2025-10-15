// Tema automático + manual
const metaTheme=document.getElementById('theme-color-meta');
const themeToggle=document.getElementById('theme-toggle');
function applyTheme(dark){
  if(dark){document.body.classList.add('dark');metaTheme.setAttribute('content','#0b1220');localStorage.setItem('theme','dark');themeToggle.textContent='🌙 Modo Escuro Ativo — Alternar';}
  else{document.body.classList.remove('dark');metaTheme.setAttribute('content','#f9fafb');localStorage.setItem('theme','light');themeToggle.textContent='🌞 Modo Claro Ativo — Alternar';}
}
const mq=window.matchMedia('(prefers-color-scheme: dark)');
const saved=localStorage.getItem('theme');
if(saved)applyTheme(saved==='dark');else applyTheme(mq.matches);
mq.addEventListener('change',e=>{if(!localStorage.getItem('theme'))applyTheme(e.matches);});
themeToggle.addEventListener('click',()=>applyTheme(!document.body.classList.contains('dark')));

// Sincronização entre módulos
function syncByClass(cls){
  document.querySelectorAll('.'+cls).forEach(el=>{
    el.addEventListener('input',e=>{
      const val=e.target.value;
      document.querySelectorAll('.'+cls).forEach(i=>{if(i!==e.target)i.value=val;});
    });
  });
}
syncByClass('avaliacao-integrada');
syncByClass('teste-progresso');
