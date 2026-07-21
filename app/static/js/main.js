const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
if (menuButton && mobileMenu) {
  const closeMenu = () => { menuButton.setAttribute('aria-expanded','false'); mobileMenu.hidden = true; };
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); mobileMenu.hidden = open; });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); menuButton.focus(); } });
}

const problemContent = {
  website: {label:'Digital presence diagnosis',title:'Your website should create clarity before the first conversation.',copy:'We examine structure, speed, search foundations, messaging, conversion paths, and maintainability—then design a digital experience around what customers actually need.',items:['Experience redesign','Technical SEO','Lead pathways','Performance review']},
  data: {label:'Data reliability diagnosis',title:'Decisions improve when the underlying data can be trusted.',copy:'We profile messy files, identify structural problems, validate rules, consolidate sources, and design reporting that makes uncertainty visible instead of hiding it.',items:['Data profiling','Quality rules','Source consolidation','Decision dashboards']},
  manual: {label:'Operations diagnosis',title:'Repeated manual work is usually a system design problem.',copy:'We map handoffs, delays, repeated entry, missed follow-ups, and exception paths—then automate the stable work while keeping people in control of risky decisions.',items:['Workflow mapping','Automation design','Tool integration','Exception handling']},
  ai: {label:'AI readiness diagnosis',title:'The best AI upgrade starts with a narrow, useful job.',copy:'We identify high-value use cases, define approved knowledge, design human review, and connect assistants to the tools and workflows your team already understands.',items:['Chat assistants','Voice workflows','Document intelligence','Human review']},
  seo: {label:'Search growth diagnosis',title:'Being online is not the same as being discoverable.',copy:'We review technical SEO, local search signals, page intent, content gaps, measurement, and inquiry paths so visibility supports qualified business opportunities.',items:['Technical SEO','Local visibility','Content architecture','Conversion tracking']},
  assessment: {label:'Technology gap assessment',title:'Fix the highest-impact gaps first—not the loudest ones.',copy:'We review the website, data, workflows, integrations, AI readiness, and search foundation, then deliver findings, priorities, dependencies, and a practical roadmap.',items:['Current-state review','Risk priorities','Quick wins','Implementation roadmap']}
};

document.querySelectorAll('[data-problem]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-problem]').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected','false'); });
    button.classList.add('active'); button.setAttribute('aria-selected','true');
    const content = problemContent[button.dataset.problem];
    document.querySelector('[data-diagnosis-label]').textContent = content.label;
    document.querySelector('[data-diagnosis-title]').textContent = content.title;
    document.querySelector('[data-diagnosis-copy]').textContent = content.copy;
    document.querySelector('[data-deliverables]').innerHTML = content.items.map(item => `<span>${item}</span>`).join('');
  });
});

const demoContent = {
  chat:{label:'Illustrative AI conversation',title:'Helpful first response. Clear human handoff.',copy:'A business-trained assistant answers approved questions, gathers useful context, and moves the conversation to the right person when judgment is required.',html:'<div class="chat-message ai">Hi—are you looking for a new website, automation, or an AI upgrade?</div><div class="chat-message user">We spend hours qualifying the same inquiries.</div><div class="chat-message ai">I can collect project type, budget range, and timing—then route qualified requests to your team.</div><div class="chat-message ai typing"><i></i><i></i><i></i></div>'},
  voice:{label:'Illustrative voice workflow',title:'Answer, qualify, schedule, and hand off.',copy:'A voice assistant can handle approved first-line conversations, collect structured details, schedule the next step, and escalate sensitive or unusual requests.',html:'<div class="chat-message ai"><strong>Incoming call</strong><br>“Thanks for calling. What can I help you with today?”</div><div class="flow-map"><span class="flow-node">Call</span><span class="flow-link"></span><span class="flow-node">Qualify</span><span class="flow-link"></span><span class="flow-node">Human</span></div><div class="signal-line"><i style="width:84%"></i></div>'},
  avatar:{label:'Illustrative content workflow',title:'Consistent content with human approval built in.',copy:'A controlled avatar workflow can turn an approved topic into a script, visual draft, and review queue—without publishing anything before a person approves it.',html:'<div class="flow-map"><span class="flow-node">Topic</span><span class="flow-link"></span><span class="flow-node">Script</span><span class="flow-link"></span><span class="flow-node">Draft</span></div><div class="chat-message ai"><strong>Human review required</strong><br>Brand voice, facts, claims, and publishing remain under your control.</div>'}
};

document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-demo]').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected','false'); });
  button.classList.add('active'); button.setAttribute('aria-selected','true');
  const content = demoContent[button.dataset.demo];
  document.querySelector('[data-demo-label]').textContent = content.label;
  document.querySelector('[data-demo-title]').textContent = content.title;
  document.querySelector('[data-demo-copy]').textContent = content.copy;
  document.querySelector('[data-demo-visual]').innerHTML = content.html;
}));

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), {threshold:.12}) : null;
document.querySelectorAll('.reveal').forEach(element => revealObserver ? revealObserver.observe(element) : element.classList.add('is-visible'));

const commandCard = document.querySelector('[data-command-card]');
if (commandCard && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  commandCard.closest('.experience-stage').addEventListener('pointermove', event => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    commandCard.style.transform = `rotateY(${x * 7 - 4}deg) rotateX(${y * -5 + 2}deg) translate3d(${x * 5}px,${y * 5}px,0)`;
  });
  commandCard.closest('.experience-stage').addEventListener('pointerleave', () => { commandCard.style.transform = 'rotateY(-5deg) rotateX(2deg)'; });
}

const consultationForm = document.querySelector('[data-consultation-form]');
const formMessage = document.querySelector('[data-form-message]');
if (consultationForm && formMessage) consultationForm.addEventListener('submit', event => { event.preventDefault(); if (!consultationForm.checkValidity()) return consultationForm.reportValidity(); formMessage.textContent = 'This preview did not send your information. Please use the booking page while inquiry processing is being connected.'; });