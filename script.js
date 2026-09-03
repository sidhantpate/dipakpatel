const sections = document.querySelectorAll("section[id]");
const nav = document.querySelector("nav");
const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.appendChild(progress);

document.querySelectorAll('a[href^="#"]').forEach(link=>{
	link.addEventListener("click",event=>{
		event.preventDefault();
		document.querySelector(link.getAttribute("href"))?.scrollIntoView({behavior:"smooth"});
	});
});

document.querySelectorAll("section, .cards > div").forEach(element=>element.classList.add("reveal"));
const revealObserver = new IntersectionObserver(entries=>{
	entries.forEach(entry=>{
		if(entry.isIntersecting) revealObserver.observe(entry.target), entry.target.classList.add("visible");
	});
},{threshold:.15});
document.querySelectorAll(".reveal").forEach(element=>revealObserver.observe(element));

const updateScrollState = ()=>{
	const scrollable = document.documentElement.scrollHeight - window.innerHeight;
	progress.style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
	nav.classList.toggle("scrolled",window.scrollY > 12);
	let currentId = "";
	sections.forEach(section=>{
		if(window.scrollY >= section.offsetTop - 160) currentId = section.id;
	});
	document.querySelectorAll('nav a[href^="#"]').forEach(link=>link.classList.toggle("active",link.getAttribute("href") === `#${currentId}`));
};
window.addEventListener("scroll",updateScrollState,{passive:true});
updateScrollState();

document.addEventListener("pointermove",event=>{
	document.body.style.setProperty("--mouse-x",`${event.clientX}px`);
	document.body.style.setProperty("--mouse-y",`${event.clientY}px`);
	const card = event.target.closest(".cards > div");
	if(!card) return;
	const bounds = card.getBoundingClientRect();
	card.style.setProperty("--rotate-y",((event.clientX - bounds.left) / bounds.width - .5) * 10);
	card.style.setProperty("--rotate-x",((event.clientY - bounds.top) / bounds.height - .5) * -10);
});

document.querySelectorAll(".cards > div").forEach(card=>card.addEventListener("pointerleave",()=>{
	card.style.removeProperty("--rotate-x");
	card.style.removeProperty("--rotate-y");
}));
