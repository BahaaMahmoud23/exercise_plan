import { useEffect, useState, type FormEvent } from 'react';
import { dateKey } from '../data/tracking';
import { CALORIE_KEY, meals, emptyCalories, readCalories, saveCalories, weekSummary, proteinSummary, dayTotals, shiftDate, type CalorieData, type Food, type FoodDay } from '../data/calories';
import './calories.css';

const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 1 });
const weekday = (date: string) => new Intl.DateTimeFormat('ar-SA', { weekday: 'long', timeZone: 'Asia/Riyadh' }).format(new Date(`${date}T12:00:00Z`));
const mealNames = { Breakfast: 'الفطور', Lunch: 'الغداء', Dinner: 'العشاء', Snack: 'سناك' };

export function CalorieTracker({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<CalorieData>(emptyCalories);
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState(dateKey);
  const [editing, setEditing] = useState<Food | null>(null);
  const [formKey, setFormKey] = useState(0);
  const load = () => {
    try { setData(readCalories(window.localStorage)); setBlocked(false); setError(''); }
    catch { setBlocked(true); setError('تعذر قراءة البيانات. الحفظ متوقف لحماية السجلات الموجودة. تحقق من تخزين المتصفح وأعد المحاولة.'); }
  };
  useEffect(() => {
    load();
    const sync = (e: StorageEvent) => { if (e.key === CALORIE_KEY || e.key === null) load(); };
    window.addEventListener('storage', sync); return () => window.removeEventListener('storage', sync);
  }, []);
  const summary = weekSummary(data, selected);
  const day: FoodDay = data.days[selected] ?? { completed: false, entries: [] };
  const totals = dayTotals(day);
  const protein = proteinSummary(data, totals.protein);
  const commit = (update: (d: CalorieData) => CalorieData) => {
    if (blocked) return false;
    try { setData(saveCalories(window.localStorage, current => {
      const next = update(current), start = summary.dates[0];
      return { ...next, weeks: { ...next.weeks, [start]: next.weeks[start] ?? { ...current.defaults } } };
    })); setMessage('تم الحفظ على هذا الجهاز'); setError(''); return true; }
    catch { setError('تعذر الحفظ. لم تُحفظ التغييرات. البيانات السابقة محفوظة؛ أعد المحاولة.'); return false; }
  };
  const changeDay = (date: string) => { setSelected(date); setEditing(null); setFormKey(k => k + 1); setMessage(''); };
  const updateDay = (update: (d: FoodDay) => FoodDay) => commit(current => ({ ...current, days: { ...current.days, [selected]: update(current.days[selected] ?? { completed: false, entries: [] }) } }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const f = new FormData(event.currentTarget);
    const food: Food = { id: editing?.id ?? crypto.randomUUID(), name: String(f.get('name')).trim(), quantity: Number(f.get('quantity')), unit: String(f.get('unit')), calories: Number(f.get('calories')), protein: Number(f.get('protein')), meal: String(f.get('meal')) as Food['meal'], notes: String(f.get('notes')).trim() };
    if (!food.name) { setError('اكتب اسم الطعام'); return; }
    if (updateDay(d => {
      if (d.completed) throw new Error('Reopen day first');
      return { ...d, entries: editing ? d.entries.map(e => e.id === editing.id ? food : e) : [...d.entries, food] };
    })) { setEditing(null); setFormKey(k => k + 1); }
  };
  return <main className="app-shell calorie-tracker" dir="rtl" lang="ar">
    <nav className="calorie-toolbar"><button type="button" className="back-button" onClick={onBack}>العودة للتمارين</button><span>Asia/Riyadh · حفظ محلي على هذا المتصفح</span></nav>
    <header><span className="section-kicker">Calorie Tracker</span><h1>حساب السعرات</h1><p>ميزانية أسبوعية مرنة، تسجل فيها أكلك يوم بيوم. القيم الغذائية تُدخل يدويًا وقد تكون تقديرية.</p></header>
    {error && <div role="alert" className="calorie-error">{error}<button type="button" onClick={load}>إعادة قراءة البيانات</button></div>}
    <p role="status" aria-live="polite">{message}</p>
    <div className="calorie-toolbar"><button type="button" className="back-button" onClick={() => changeDay(shiftDate(selected, -7))}>الأسبوع السابق</button><button type="button" className="back-button" onClick={() => changeDay(dateKey())}>الأسبوع الحالي</button><button type="button" className="back-button" onClick={() => changeDay(shiftDate(selected, 7))}>الأسبوع التالي</button><span dir="ltr">{summary.dates[0]} — {summary.dates[6]}</span></div>
    <section className="calorie-stats" aria-label="ملخص الأسبوع">
      {[
        ['ميزانية الأسبوع', `${fmt(summary.budget)} kcal`], ['السعرات المستهلكة', `${fmt(summary.consumed)} kcal`], ['السعرات المتبقية', `${fmt(summary.remaining)} kcal`],
        ['المتاح لكل يوم مفتوح', summary.average === null ? 'كل الأيام مكتملة' : summary.remaining < 0 ? 'لا تعويض قاسٍ مطلوب' : `${fmt(summary.average)} kcal`], ['بروتين الأسبوع', `${fmt(summary.protein)} / ${fmt(protein.weeklyReference)} g`],
      ].map(([label, value]) => <article className="calorie-panel" key={label}><span>{label}</span><strong dir="auto">{value}</strong></article>)}
    </section>
    <div className="calorie-panel"><p>{summary.completed} أيام مكتملة · {summary.remainingDays} أيام مفتوحة · استهلاك {fmt(summary.percentage)}٪</p><progress aria-label="نسبة استهلاك الميزانية" max={100} value={Math.min(100,summary.percentage)} />
      <p>المتوسط = الرصيد المتبقي ÷ الأيام غير المغلقة، بما فيها اليوم الحالي إذا كان مفتوحًا. الأيام الخالية لا تُغلق تلقائيًا.</p>
      {summary.remaining < 0 && <p className="calorie-error">تجاوزت ميزانية الأسبوع بـ {fmt(-summary.remaining)} سعرة. لا تحتاج لتعويض قاسٍ أو حرمان؛ راجع هدفك بهدوء.</p>}
    </div>
    <section className="calorie-week" aria-label="أيام الأسبوع">
      {summary.dates.map(date => { const d = data.days[date], t = dayTotals(d); return <button type="button" className={`calorie-panel ${date === selected ? 'is-selected' : ''}`} aria-pressed={date === selected} key={date} onClick={() => changeDay(date)}><strong>{weekday(date)}</strong><span dir="ltr">{date}</span><b>{fmt(t.calories)} kcal</b><span>{d?.completed ? 'مكتمل' : d?.entries.length ? 'قيد التسجيل' : 'لم يبدأ'}</span>{t.calories > summary.reference && <small>أعلى من المرجع اليومي</small>}</button>; })}
    </section>
    <section className="calorie-panel" aria-label="الرسم الأسبوعي"><h2>استهلاك الأسبوع</h2><p>المرجع اليومي: {fmt(summary.reference)} kcal · تجاوز المرجع ليس فشلًا</p><div className="calorie-chart">{summary.dates.map(date => { const d=data.days[date], t=dayTotals(d), max=Math.max(summary.reference,...summary.dates.map(v=>dayTotals(data.days[v]).calories)); return <div key={date}><span>{fmt(t.calories)}</span><div className="calorie-bar-track"><div className={`calorie-bar ${d?.completed ? 'closed' : ''}`} style={{height:`${t.calories / max * 100}%`}} /></div><span>{weekday(date)}</span><small>{d?.completed ? 'مكتمل' : d?.entries.length ? 'مسجل' : 'بلا إدخالات'}</small></div>; })}</div></section>
    <section className="calorie-panel"><div className="calorie-toolbar"><h2>{weekday(selected)}</h2><label>تاريخ التسجيل<input aria-label="تاريخ التسجيل" type="date" required value={selected} onChange={e => { if(e.target.value) changeDay(e.target.value); }} /></label><button type="button" className="back-button" disabled={blocked} onClick={() => { if(updateDay(d => ({ ...d, completed: !d.completed }))) {setEditing(null);setFormKey(k=>k+1);} }}>{day.completed ? 'إعادة فتح اليوم' : 'إنهاء اليوم'}</button></div>
      <p>{fmt(totals.calories)} kcal · {fmt(totals.protein)} g بروتين · متبقي الأسبوع {fmt(summary.remaining)} kcal</p><p>اليوم يظل مفتوحًا بعد منتصف الليل حتى تنهيه بنفسك. يمكنك اختيار تاريخ الأمس لتكملة تسجيله.</p>
      {day.completed ? <p>اليوم مكتمل. أعد فتحه لتعديل الطعام.</p> : <form key={`${selected}-${editing?.id ?? 'new'}-${formKey}`} onSubmit={submit} className="calorie-form">
        <label>اسم الطعام<input name="name" required maxLength={160} defaultValue={editing?.name ?? ''} /></label>
        <label>الكمية<input name="quantity" type="number" required min="0.01" step="any" defaultValue={editing?.quantity ?? 1} /></label>
        <label>الوحدة<select name="unit" defaultValue={editing?.unit ?? 'g'}>{['g','kg','ml','قطعة','حصة','كوب','ملعقة'].map(u=><option key={u}>{u}</option>)}</select></label>
        <label>السعرات (kcal)<input name="calories" type="number" required min="0" step="any" defaultValue={editing?.calories ?? ''} /></label>
        <label>البروتين (g)<input name="protein" type="number" required min="0" step="any" defaultValue={editing?.protein ?? ''} /></label>
        <label>الوجبة<select name="meal" defaultValue={editing?.meal ?? 'Breakfast'}>{meals.map(m=><option value={m} key={m}>{mealNames[m]}</option>)}</select></label>
        <label className="calorie-wide">ملاحظات (اختياري)<textarea name="notes" maxLength={1000} defaultValue={editing?.notes ?? ''} /></label>
        <p className="calorie-wide">أدخل السعرات والبروتين لإجمالي الكمية المكتوبة، وليس لكل جرام. لا تُضاف سعرات التمرين للميزانية.</p>
        <button type="submit" className="back-button" disabled={blocked}>{editing ? 'حفظ التعديل' : 'إضافة طعام'}</button>{editing && <button type="button" className="back-button" onClick={()=>setEditing(null)}>إلغاء التعديل</button>}
      </form>}
      <div className="calorie-panel" aria-label="هدف البروتين اليومي"><h3>بروتين اليوم</h3><p>{fmt(totals.protein)} / {fmt(protein.target)} g · المتبقي {fmt(protein.remaining)} g · {fmt(protein.percentage)}٪</p><progress aria-label="تقدم البروتين اليومي" max={100} value={Math.min(100, protein.percentage)} /><p>هدف يومي مستقل عن السعرات، ثابت في أيام التمرين والراحة. إجمالي الأسبوع مرجع فقط؛ لا يعوض نقص البروتين في يوم آخر.</p></div>
      {!day.entries.length && <p>لا يوجد طعام مسجل لهذا اليوم. أضف أول وجبة عندما تكون جاهزًا.</p>}
      <ul className="calorie-entries">{day.entries.map(food => <li key={food.id}><div><strong>{food.name}</strong><p>{food.quantity} {food.unit} · {mealNames[food.meal]} · {fmt(food.calories)} kcal · {fmt(food.protein)} g بروتين</p>{food.notes && <p>{food.notes}</p>}</div><div className="calorie-toolbar"><button className="back-button" type="button" disabled={day.completed || blocked} onClick={()=>setEditing(food)}>تعديل {food.name}</button><button className="back-button" type="button" disabled={day.completed || blocked} onClick={()=>{if(window.confirm(`حذف ${food.name}؟`)) {if(updateDay(d=>({...d,entries:d.entries.filter(e=>e.id!==food.id)})) && editing?.id===food.id)setEditing(null);}}}>حذف {food.name}</button></div></li>)}</ul>
    </section>
    <details className="calorie-panel"><summary>تعديل الميزانية والبيانات الشخصية</summary><p>الميزانية والمرجع لهذا الأسبوع فقط. اختيار تطبيقهما على الأسابيع الجديدة لا يغير الأسابيع المحفوظة.</p><form key={`${summary.dates[0]}-${summary.budget}-${summary.reference}`} className="calorie-form" onSubmit={event=>{event.preventDefault();const f=new FormData(event.currentTarget);const config={budget:Number(f.get('budget')),reference:Number(f.get('reference'))};commit(d=>({...d,proteinTarget:Number(f.get('proteinTarget')),profile:{weight:Number(f.get('weight')),height:Number(f.get('height')),age:Number(f.get('age')),training:Number(f.get('training'))},defaults:f.get('defaults')?config:d.defaults,weeks:{...d.weeks,[summary.dates[0]]:config}}));}}>
      <label>هدف البروتين اليومي (g)<input name="proteinTarget" required type="number" min="1" step="any" defaultValue={data.proteinTarget}/></label>
      <label>ميزانية الأسبوع (kcal)<input name="budget" required type="number" min="1" step="any" defaultValue={summary.budget}/></label><label>المرجع اليومي (kcal)<input name="reference" required type="number" min="1" step="any" defaultValue={summary.reference}/></label>
      {([['weight','الوزن (kg)'],['height','الطول (cm)'],['age','العمر'],['training','أيام التمرين أسبوعيًا']] as const).map(([key,label])=><label key={key}>{label}<input name={key} required type="number" min={key==='training'?0:1} max={key==='training'?7:undefined} step={key==='weight'||key==='height'?'any':'1'} defaultValue={data.profile[key]}/></label>)}
      <label className="calorie-wide"><span><input name="defaults" type="checkbox"/> استخدام الميزانية والمرجع للأسابيع الجديدة أيضًا</span></label><button type="submit" className="back-button" disabled={blocked}>حفظ الإعدادات</button>
    </form></details>
  </main>;
}
