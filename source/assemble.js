const fs=require('fs');
const css=fs.readFileSync('build/out.css','utf8');
const js=fs.readFileSync('build/app.js','utf8').replace(/<\/script/gi,'<\\/script');
const html=`<title>AtlasBid UK</title>
<meta name="description" content="Morocco procurement intelligence and partnership prototype for UK companies / Veille des marchés marocains et partenariats pour les entreprises britanniques">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap">
<style>
/* Layout: navy rail + ivory canvas institutional SaaS shell. Deliberately single light theme per brief. */
:root{--navy:#0F172A;--canvas:#FFFFFF;--ink:#0f172a;--accent:#059669;color-scheme:light}
html,body{background:var(--canvas);color:var(--ink)}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-size:15px;line-height:1.5}
:focus{outline:none}
:focus-visible{outline:2px solid #059669;outline-offset:2px;border-radius:6px}
::selection{background:#d1fae5}
${css}
</style>
<div id="root"></div>
<script>${js}</script>`;
fs.writeFileSync('/home/claude/atlasbid-uk.html',html);
console.log(html.length);
