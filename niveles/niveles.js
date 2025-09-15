const canvas = document.getElementById('confeti');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];
for(let i=0;i<60;i++){
    particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*6+4,
        d: Math.random()*Math.PI*2,
        color: `hsl(${Math.random()*360},90%,60%)`,
        speed: Math.random()*1+0.5
    });
}
function drawParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let p of particles){
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.color;
        ctx.fill();
        p.y+=p.speed;
        p.x+=Math.sin(p.d)*1.5;
        if(p.y>canvas.height)p.y=0;
        if(p.x>canvas.width)p.x=0;
    }
    requestAnimationFrame(drawParticles);
}
drawParticles();
window.addEventListener('resize',()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
});
