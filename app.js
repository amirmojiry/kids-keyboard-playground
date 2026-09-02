const stage = document.getElementById("stage");
const letterEl = document.getElementById("letter");
const wordEl = document.getElementById("word");
const keyLabelEl = document.getElementById("keyLabel");
const hintEl = document.getElementById("hint");
const soundToggle = document.getElementById("soundToggle");

const state = { language:"fa", mode:"letter", sound:true, escapeCount:0, lastEscapeAt:0 };

const english = {
  KeyA:["A","Apple"], KeyB:["B","Ball"], KeyC:["C","Cat"], KeyD:["D","Dog"], KeyE:["E","Elephant"],
  KeyF:["F","Fish"], KeyG:["G","Grapes"], KeyH:["H","House"], KeyI:["I","Ice cream"], KeyJ:["J","Juice"],
  KeyK:["K","Kite"], KeyL:["L","Lion"], KeyM:["M","Moon"], KeyN:["N","Nest"], KeyO:["O","Orange"],
  KeyP:["P","Penguin"], KeyQ:["Q","Queen"], KeyR:["R","Rabbit"], KeyS:["S","Sun"], KeyT:["T","Tiger"],
  KeyU:["U","Umbrella"], KeyV:["V","Van"], KeyW:["W","Whale"], KeyX:["X","Xylophone"], KeyY:["Y","Yo-yo"], KeyZ:["Z","Zebra"]
};

const persian = {
  KeyA:["ش","شیر"], KeyB:["ذ","ذرت"], KeyC:["ز","زنبور"], KeyD:["ی","یخ"], KeyE:["ث","ثانیه"], KeyF:["ب","بادکنک"],
  KeyG:["ل","لیمو"], KeyH:["ا","ابر"], KeyI:["ه","هلو"], KeyJ:["ت","توپ"], KeyK:["ن","نان"], KeyL:["م","ماهی"],
  KeyM:["ئ","رئیس"], KeyN:["د","درخت"], KeyO:["خ","خرگوش"], KeyP:["ح","حوض"], KeyQ:["ض","ضرب"], KeyR:["ق","قایق"],
  KeyS:["س","سیب"], KeyT:["ف","فیل"], KeyU:["ع","عسل"], KeyV:["ر","روباه"], KeyW:["ص","صابون"], KeyX:["ط","طوطی"],
  KeyY:["غ","غاز"], KeyZ:["ظ","ظرف"], BracketLeft:["ج","جوجه"], BracketRight:["چ","چتر"], Backslash:["پ","پروانه"],
  Semicolon:["ک","کبوتر"], Quote:["گ","گربه"], Comma:["و","وان"]
};

function numberFa(n){ return ["صفر","یک","دو","سه","چهار","پنج","شش","هفت","هشت","نه","ده","یازده","دوازده"][n] ?? String(n); }
function numberEn(n){ return ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve"][n] ?? String(n); }

const specialKeys = {
  Space:{fa:["␣","فاصله!"],en:["␣","Space!"]}, Enter:{fa:["↵","آفرین!"],en:["↵","Great!"]},
  Backspace:{fa:["⌫","پاکش کن!"],en:["⌫","Backspace!"]}, Tab:{fa:["⇥","بپر بعدی!"],en:["⇥","Tab!"]},
  ArrowUp:{fa:["↑","بالا!"],en:["↑","Up!"]}, ArrowDown:{fa:["↓","پایین!"],en:["↓","Down!"]},
  ArrowLeft:{fa:["←","چپ!"],en:["←","Left!"]}, ArrowRight:{fa:["→","راست!"],en:["→","Right!"]},
  CapsLock:{fa:["⇪","کپس لاک!"],en:["⇪","Caps Lock!"]}, Escape:{fa:["Esc","اِسکِیپ!"],en:["Esc","Escape!"]},
  Delete:{fa:["Del","حذف!"],en:["Del","Delete!"]}, Home:{fa:["Home","خانه!"],en:["Home","Home!"]}, End:{fa:["End","پایان!"],en:["End","End!"]}
};

for(let i=0;i<=9;i++){
  specialKeys[`Digit${i}`]={fa:[String(i),numberFa(i)],en:[String(i),numberEn(i)]};
  specialKeys[`Numpad${i}`]=specialKeys[`Digit${i}`];
}
for(let i=1;i<=12;i++) specialKeys[`F${i}`]={fa:[`F${i}`,`اِف ${numberFa(i)}`],en:[`F${i}`,`F ${i}`]};

function getEntry(code){
  const letters=state.language==="fa"?persian:english;
  if(letters[code]){
    const [letter,word]=letters[code];
    return {display:letter,word:state.mode==="word"?word:"",speech:state.mode==="word"?`${letter}. ${word}`:letter};
  }
  if(specialKeys[code]){
    const [display,speech]=specialKeys[code][state.language];
    return {display,word:"",speech};
  }
  return {display:"✨",word:"",speech:state.language==="fa"?"یک کلید جالب!":"A funny key!"};
}

function speak(text){
  if(!state.sound || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=state.language==="fa"?"fa-IR":"en-US";
  u.rate=state.language==="fa"?.78:.82;
  u.pitch=1.45;
  u.volume=1;
  const voices=speechSynthesis.getVoices();
  const preferred=voices.find(v=>v.lang.toLowerCase().startsWith(state.language==="fa"?"fa":"en"));
  if(preferred) u.voice=preferred;
  speechSynthesis.speak(u);
}

function animate(){
  letterEl.classList.remove("pop"); wordEl.classList.remove("bounce"); stage.classList.remove("flash");
  void letterEl.offsetWidth;
  letterEl.classList.add("pop"); wordEl.classList.add("bounce"); stage.classList.add("flash");
}

function showEntry(entry,code){
  hintEl.textContent=state.language==="fa"?"آفرین! یکی دیگه بزن 👏":"Great! Press another key 👏";
  letterEl.textContent=entry.display; wordEl.textContent=entry.word;
  keyLabelEl.textContent=state.language==="fa"?`کلید ${code}`:`Key ${code}`;
  animate(); speak(entry.speech);
}

function handleEscapeShortcut(){
  const now=Date.now();
  if(now-state.lastEscapeAt>1800) state.escapeCount=0;
  state.lastEscapeAt=now; state.escapeCount++;
  if(state.escapeCount>=3){
    state.escapeCount=0;
    document.querySelector(".toolbar").classList.toggle("hidden");
    document.querySelector(".footer-note").classList.toggle("hidden");
  }
}

document.addEventListener("keydown",event=>{
  if(["Space","Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Backspace"].includes(event.code)) event.preventDefault();
  if(event.code==="Escape") handleEscapeShortcut();
  showEntry(getEntry(event.code),event.code);
});

document.querySelectorAll("[data-language]").forEach(button=>button.addEventListener("click",()=>{
  state.language=button.dataset.language;
  document.documentElement.lang=state.language==="fa"?"fa":"en";
  document.documentElement.dir=state.language==="fa"?"rtl":"ltr";
  document.querySelectorAll("[data-language]").forEach(b=>b.classList.toggle("active",b===button));
  hintEl.textContent=state.language==="fa"?"یک کلید روی کیبورد بزن!":"Press a key!";
  letterEl.textContent=state.language==="fa"?"آ":"A";
  wordEl.textContent=state.mode==="word"?(state.language==="fa"?"آب":"Apple"):"";
  keyLabelEl.textContent="";
}));

document.querySelectorAll("[data-mode]").forEach(button=>button.addEventListener("click",()=>{
  state.mode=button.dataset.mode;
  document.querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b===button));
  wordEl.textContent=state.mode==="word"?(state.language==="fa"?"آب":"Apple"):"";
}));

soundToggle.addEventListener("click",()=>{
  state.sound=!state.sound;
  soundToggle.textContent=state.sound?"🔊":"🔇";
  soundToggle.setAttribute("aria-pressed",String(state.sound));
  if(!state.sound && "speechSynthesis" in window) speechSynthesis.cancel();
});

if("speechSynthesis" in window) speechSynthesis.getVoices();
stage.focus();
