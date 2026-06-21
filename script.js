let last=""

loadHistory()

async function scan(){

if(
!api.value||
!msg.value
){

alert(
"Enter API + Message"
)

return

}

result.classList
.remove(
"hidden"
)

reason.innerHTML=
"🧠 Scanning..."

detectUrls(
msg.value
)

try{

const r=

await fetch(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api.value}`,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:

JSON.stringify({

contents:[

{

parts:[

{

text:
`

You are KAVACH AI.

Analyze scam.

Return ONLY JSON:

{
"score":0,
"verdict":"",
"points":[
"",
"",
""
]
}

Message:

${msg.value}

`

}

]

}

]

})

}

)

const data=
await r.json()

let text=

data
.candidates[0]
.content
.parts[0]
.text

text=
text
.replace(
/```json/g,
""
)
.replace(
/```/g,
""
)

let out=
JSON.parse(
text
)

last=
out.points.join(
". "
)

update(
out.score
)

reason.innerHTML=

`

<h2>

${out.verdict}

</h2>

<ul>

${out.points
.map(
p=>
`<li>${p}</li>`
)
.join("")}

</ul>

`

save(
out.score,
out.verdict
)

}
catch{

reason.innerHTML=

"❌ Failed"

}

}

function update(score){

bar.style.width=
score+"%"

bar.innerHTML=
score+"%"

bar.className=""

if(score<30){

bar.classList.add(
"safe"
)

badge.innerHTML=
"🟢 SAFE"

}

else if(score<70){

bar.classList.add(
"warning"
)

badge.innerHTML=
"🟡 WARNING"

}

else{

bar.classList.add(
"danger"
)

badge.innerHTML=
"🔴 HIGH RISK"

}

}

function speak(){

speechSynthesis
.speak(

new SpeechSynthesisUtterance(
last
)

)

}

function detectUrls(t){

let u=

t.match(
/https?:\/\/[^\s]+/g
)

urls.innerHTML=

u
?
u.join("<br>")
:
"None"

}

function save(s,v){

let h=

JSON.parse(

localStorage
.getItem(
"kavach"
)

||
"[]"

)

h.unshift(
`${s}% • ${v}`
)

h=h.slice(
0,
6
)

localStorage
.setItem(
"kavach",

JSON.stringify(
h
)

)

loadHistory()

}

function loadHistory(){

history.innerHTML=

(
JSON.parse(
localStorage
.getItem(
"kavach"
)

||
"[]"
)

).join(
"<br>"
)

||
"Empty"

}