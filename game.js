const $ = (id) => document.getElementById(id);
const tg = window.Telegram?.WebApp;
tg?.ready(); tg?.expand();
const state = {money:250,rep:0,served:0,level:1,step:0,patience:100,orderIndex:0};
const steps = ['lavash','meat','veg','sauce','wrap'];
const names = {lavash:'Лаваш',meat:'Курица',veg:'Овощи',sauce:'Соус',wrap:'Завернуть'};
const customers = [
  {name:'Артём',avatar:'🧔',title:'Классическая шаурма',desc:'Лаваш, курица, овощи, чесночный соус',tip:'Классика — хит продаж.'},
  {name:'Катя',avatar:'👩',title:'Шаурма с острым соусом',desc:'Лаваш, курица, овощи, острый соус',tip:'Разнообразие помогает заработать репутацию.'},
  {name:'Дед Валера',avatar:'👴',title:'Большая шаурма',desc:'Побольше курицы и овощей. Не жалей начинки!',tip:'Щедрые порции радуют постоянных клиентов.'}
];
function render(){
 $('money').textContent=state.money+' ₽';$('rep').textContent=state.rep;$('served').textContent=state.served;$('level').textContent=state.level;
 $('patience').textContent=state.patience+'%';$('patience').style.color=state.patience<35?'#ff7777':'#7ecb83';
 $('progressFill').style.width=(state.step/steps.length*100)+'%';
 $('serve').disabled=state.step!==steps.length;
 document.querySelectorAll('[data-item]').forEach((b,i)=>{b.classList.toggle('done',i<state.step);b.disabled=i<state.step||i>state.step});
}
function loadCustomer(){
 const c=customers[state.orderIndex%customers.length];
 $('customer').textContent=c.name+' ждёт';$('avatar').textContent=c.avatar;$('orderTitle').textContent=c.title;$('orderDesc').textContent=c.desc;$('tip').textContent=c.tip;
 $('recipeStatus').textContent='Сначала '+names[steps[state.step]]+'. Делай по порядку!';
}
document.querySelectorAll('[data-item]').forEach(btn=>btn.addEventListener('click',()=>{
 const item=btn.dataset.item;
 if(item!==steps[state.step]){$('feedback').textContent='Не тот ингредиент! Следующий шаг: '+names[steps[state.step]]+'.';return;}
 state.step++;$('feedback').textContent='Отлично: '+names[item]+' добавлено.';
 $('recipeStatus').textContent=state.step===5?'Готово! Выдавай заказ.':'Теперь: '+names[steps[state.step]]+'.';
 render();
}));
$('serve').addEventListener('click',()=>{
 if(state.step!==5)return;
 const bonus=state.patience>50?5:0;state.money+=65+bonus;state.rep+=10;state.served++;state.orderIndex++;state.step=0;state.patience=100;
 if(state.served%4===0){state.level++;state.money+=30;$('feedback').textContent='Заказ принят! +'+(65+bonus)+' ₽. Новый уровень! Бонус +30 ₽ 🎉';}
 else $('feedback').textContent='Клиент доволен! +'+(65+bonus)+' ₽ и +10 репутации.';
 loadCustomer();render();
 if(state.served===3){$('weather').textContent='☁️ Начался небольшой дождь. Поток клиентов может измениться.';}
});
loadCustomer();render();
setInterval(()=>{if(state.step===0&&state.patience>0){state.patience=Math.max(0,state.patience-2);render();if(state.patience===0)$('feedback').textContent='Клиент ушёл! Нажми на ингредиенты, чтобы принять следующий заказ.';}},5000);
