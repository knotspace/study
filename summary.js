(()=> {
const $=id=>document.getElementById(id),names={all:"全分野",physics:"物理",chemistry:"化学",biology:"生物",earth:"地学",geography:"地理",history:"歴史",civics:"公民"};
const order={S:0,A:1,B:2},labels={S:"最優先",A:"頻出",B:"基礎・補強"};
let db={terms:[],assets:[],modules:[]},active="all",expanded=false;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fieldOf=x=>({history:"歴史",civics:"公民"}[x.topic]||x.field||x.topic||"");
const matches=x=>active==="all"||fieldOf(x)===names[active];
function draw(){
 const query=$("summarySearch").value.trim().toLocaleLowerCase();
 $("topicHeading").textContent=names[active];
 ["moduleList","resourceList","termList"].forEach(id=>$(id).replaceChildren());
 const mods=db.modules.filter(x=>matches(x)&&(!query||JSON.stringify(x).toLocaleLowerCase().includes(query))).sort((a,b)=>(order[a.priority]??2)-(order[b.priority]??2));
 mods.forEach(m=>{
  const e=document.createElement("article");e.className="knowledge-card";
  const points=m.corePoints||m.relationships||m.questions||[],errors=m.errors||m.commonErrors||[];
  const terms=(m.keyTerms||[]).filter(t=>t.term&&t.definition).map(t=>[t.term,t.definition]).concat((m.terms||[]).filter(t=>Array.isArray(t)&&t[0]&&t[1]));
  e.innerHTML='<div class="knowledge-meta"><span>'+esc(m.grade?m.grade+"年":m.field)+'・'+esc(m.field)+'</span><b class="priority priority-'+esc(m.priority||"B")+'">'+(labels[m.priority]||"基礎・補強")+'</b></div><h3>'+esc(m.title)+'</h3><p>'+esc(m.explanation)+'</p>'+
  (terms.length?'<div class="keyterm-list">'+terms.map(t=>'<span><b>'+esc(t[0])+'</b><span>'+esc(t[1])+'</span></span>').join("")+'</div>':"")+
  (points.length?'<div class="core-points"><b>ここは必ず押さえる</b><ol>'+points.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ol></div>':"")+
  (m.formula?'<div class="formula-box"><b>公式・関係</b><p>'+esc(m.formula)+'</p></div>':"")+
  (m.example?'<div class="worked-example"><b>入試での考え方</b><p>'+esc(m.example.q||"")+'</p><small>'+(m.example.work||[]).map(esc).join(" → ")+'</small><strong>'+esc(m.example.a||"")+'</strong></div>':"")+
  (errors.length?'<div class="error-box"><b>間違えやすいポイント</b><ul>'+errors.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul></div>':"")+
  (m.questionPatterns?.length?'<div class="question-patterns"><b>よく問われる形式</b><ul>'+m.questionPatterns.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul></div>':"")+
  (m.diagrams?.length?'<div class="diagram-caption"><b>図で整理</b><p>'+m.diagrams.map(esc).join(" ／ ")+'</p></div>':"");
  $("moduleList").append(e);
 });
 const res=db.assets.filter(x=>matches({field:x.subject==="理科"?({physics:"物理",chemistry:"化学",biology:"生物",earth:"地学"}[active]||"理科"):({geography:"地理",history:"歴史",civics:"公民"}[active]||"社会")})&&(!query||JSON.stringify(x).toLocaleLowerCase().includes(query)));
 const groups=new Map();res.forEach(x=>{if(!groups.has(x.unit))groups.set(x.unit,[]);groups.get(x.unit).push(x)});
 groups.forEach((items,unit)=>{const s=document.createElement("section");s.className="resource-unit";s.innerHTML='<h3>'+esc(unit)+'</h3><div class="resource-grid">'+items.map(r=>'<article class="resource-card"><div class="resource-meta">'+(r.type==="diagram"?"KNOTオリジナル図解":r.type==="table"?"比較・整理表":"参考資料")+' <b class="priority priority-'+esc(r.priority||"B")+'">'+(labels[r.priority]||"基礎")+'</b></div><h4>'+esc(r.title)+'</h4><p class="resource-subtitle">'+esc(r.subtitle)+'</p>'+(r.nodes?'<div class="flow-diagram">'+r.nodes.map((n,i)=>{const z=String(n).split("|");return '<div><small>'+String(i+1).padStart(2,"0")+'</small><b>'+esc(z[0])+'</b>'+(z[1]?'<span>'+esc(z[1])+'</span>':"")+'</div>'}).join("")+'</div>':"")+(r.rows?'<div class="table-scroll"><table>'+(r.columns?'<thead><tr>'+r.columns.map(c=>'<th>'+esc(c)+'</th>').join("")+'</tr></thead>':"")+'<tbody>'+r.rows.map(row=>'<tr>'+row.map((c,i)=>'<td class="'+(!i?"key-cell":"")+'">'+esc(c)+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>':"")+(r.image?'<figure><img loading="lazy" src="./legacy-assets/'+esc(r.image.src.split("/").pop())+'" alt="'+esc(r.image.alt)+'"><figcaption>'+esc(r.image.caption)+'</figcaption></figure>':"")+(r.note?'<p class="resource-note">'+esc(r.note)+'</p>':"")+(r.source?'<small class="source-note">資料：'+esc(r.source)+'</small>':"")+'</article>').join("")+'</div>'; $("resourceList").append(s)});
 const terms=db.terms.filter(x=>matches(x)&&(!query||[x.term,x.prompt,x.explanation].join(" ").toLocaleLowerCase().includes(query))).sort((a,b)=>(order[a.priority]??2)-(order[b.priority]??2));
 const limit=expanded?terms.length:(active==="all"?70:35);
 terms.slice(0,limit).forEach((t,i)=>{const d=document.createElement("details");d.className="term-card";d.innerHTML='<summary><span>'+String(i+1).padStart(2,"0")+'</span><div><b>'+esc(t.term)+'</b><small>'+esc(t.prompt)+'</small></div><strong>＋</strong></summary><div class="term-answer"><p>'+esc(t.explanation)+'</p></div>'; $("termList").append(d)});
 $("visibleCount").textContent=mods.length+"解説 / "+res.length+"図解・資料 / "+terms.length+"確認項目";
 $("moduleList").hidden=!mods.length;$("resourceList").hidden=!res.length;$("termList").hidden=!terms.length;
 $("termMore")?.remove();
 if(terms.length>limit){const b=document.createElement("button");b.id="termMore";b.className="term-more";b.textContent=expanded?"重要語句をたたむ":"残り"+(terms.length-limit)+"項目も表示";b.addEventListener("click",()=>{expanded=!expanded;draw()});$("termList").after(b)}
 if(!mods.length&&!res.length&&!terms.length)$("resourceList").innerHTML='<p class="no-results">該当する項目はありません。検索語を変えてみてください。</p>';
}
async function init(){try{const d=await Promise.all(["./data/summary-foundation.json","./data/summary-assets.json","./data/knowledge-base.json"].map(u=>fetch(u).then(r=>{if(!r.ok)throw Error(u);return r.json()})));db.terms=d[0].questions;db.assets=d[1].resources;db.modules=d[2].authoredModules.filter(m=>m.status==="authored");$("assetCount").textContent=db.assets.length;$("termCount").textContent=db.terms.length;$("moduleCount").textContent=db.modules.length;$("summaryLoading").hidden=true;$("summaryContent").hidden=false;draw()}catch(e){$("summaryLoading").textContent="要点ノートを読み込めませんでした。再読み込みしてください。";console.error(e)}}
$("subjectTabs").addEventListener("click",e=>{const b=e.target.closest("button[data-topic]");if(!b)return;active=b.dataset.topic;expanded=false;document.querySelectorAll("#subjectTabs button").forEach(x=>x.classList.toggle("active",x===b));draw()});
$("summarySearch").addEventListener("input",()=>{expanded=false;draw()});init();
})();