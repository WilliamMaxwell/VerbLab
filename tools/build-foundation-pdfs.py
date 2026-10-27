"""Preserved foundation workbook source; not the expanded app content generator.

Outputs only the original 4/4/3-page PDFs into scratch by default. Review rendered
pages before replacing distributed PDFs. Never writes data.js or app assets.
"""
from pathlib import Path
import argparse
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser(description="Regenerate the original 21-verb foundation PDFs only.")
parser.add_argument('--output-dir',type=Path,default=ROOT/'work/printables')
parser.add_argument('--font-regular',type=Path)
parser.add_argument('--font-bold',type=Path)
args=parser.parse_args()
OUT=args.output_dir.resolve()
OUT.mkdir(parents=True,exist_ok=True)
def choose_font(explicit,candidates):
    if explicit:
        if not explicit.is_file():parser.error(f'Font not found: {explicit}')
        return explicit
    for candidate in candidates:
        if Path(candidate).is_file():return Path(candidate)
    parser.error('Supply --font-regular and --font-bold with Unicode-capable TTF files.')
regular=choose_font(args.font_regular,['C:/Windows/Fonts/arial.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/Library/Fonts/Arial.ttf','/System/Library/Fonts/Supplemental/Arial.ttf'])
bold=choose_font(args.font_bold,['C:/Windows/Fonts/arialbd.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/Library/Fonts/Arial Bold.ttf','/System/Library/Fonts/Supplemental/Arial Bold.ttf'])
pdfmetrics.registerFont(TTFont('Arial',str(regular)))
pdfmetrics.registerFont(TTFont('ArialBold',str(bold)))
P=['yo','tú','él / ella / usted','nosotros / nosotras','ellos / ellas / ustedes']
E={'ar':['o','as','a','amos','an'],'er':['o','es','e','emos','en'],'ir':['o','es','e','imos','en']}
V=[]
for infinitive,meaning in [('hablar','to speak'),('estudiar','to study'),('bailar','to dance'),('escuchar','to listen'),('comer','to eat'),('beber','to drink'),('aprender','to learn'),('leer','to read'),('vivir','to live'),('escribir','to write'),('abrir','to open'),('recibir','to receive')]:
    V.append(dict(verb=infinitive,meaning=meaning,module=1,group=infinitive[-2:],forms=[infinitive[:-2]+e for e in E[infinitive[-2:]]],hint='Keep the stem '+infinitive[:-2]+'; use the -'+infinitive[-2:]+' endings.'))
for v,m,g,f,h in [
('ser','to be','essential',['soy','eres','es','somos','son'],'Ser has its own forms. Learn one subject at a time.'),
('estar','to be','essential',['estoy','estás','está','estamos','están'],'Estar: estoy is special; estás, está, and están need accents.'),
('ir','to go','essential',['voy','vas','va','vamos','van'],'Ir has its own forms: voy, vas, va, vamos, van.'),
('tener','to have','essential',['tengo','tienes','tiene','tenemos','tienen'],'Tener: yo tengo; e changes to ie except in nosotros.'),
('hacer','to do / make','yo',['hago','haces','hace','hacemos','hacen'],'Only yo is unusual here: hago. The other forms use regular -er endings.'),
('poner','to put','yo',['pongo','pones','pone','ponemos','ponen'],'Only yo is unusual here: pongo. Keep pon- in the other forms.'),
('querer','to want','stem',['quiero','quieres','quiere','queremos','quieren'],'Change e to ie, except in nosotros: queremos.'),
('poder','to be able to','stem',['puedo','puedes','puede','podemos','pueden'],'Change o to ue, except in nosotros: podemos.'),
('pedir','to ask for','stem',['pido','pides','pide','pedimos','piden'],'Change e to i, except in nosotros: pedimos.')]:
    V.append(dict(verb=v,meaning=m,module=2,group=g,forms=f,hint=h))
LOOK={v['verb']:v for v in V}
NAVY='#183C40'; TEAL='#156B62'; GRAY='#536267'; LIGHT='#EAF3EF'

class Book:
    def __init__(self,path,module):
        self.c=canvas.Canvas(str(path),pagesize=(612,792)); self.module=module;self.n=0;self.y=0
        self.c.setTitle('Verb Lab | '+module)
    def text(self,x,y,s,size=11,bold=False,color=NAVY):
        self.c.setFillColor(HexColor(color)); self.c.setFont('ArialBold' if bold else 'Arial',size);self.c.drawString(x,y,s)
    def page(self,title,kicker):
        if self.n:self.c.showPage()
        self.n+=1; self.text(44,752,'VERB LAB  /  '+self.module.upper(),10,True,TEAL)
        self.text(44,713,title,25,True);self.text(44,688,kicker,10,color=GRAY)
        self.c.setStrokeColor(HexColor('#B8CCC5')); self.c.line(44,672,568,672)
        self.text(44,25,'Present tense • Latin American Spanish',9,color=GRAY)
        self.text(480,25,'Verb Lab  /  '+str(self.n),9,color=GRAY);self.y=648
    def lines(self,lines,size=11,gap=18):
        for line in lines:self.text(44,self.y,line,size);self.y-=gap
        self.y-=10
    def title(self,s):self.text(44,self.y,s,14,True,TEAL);self.y-=25
    def table(self,heads,rows,widths=None):
        widths=widths or [180]+[int(344/(len(heads)-1))]*(len(heads)-1)
        rh=28;x=44
        self.c.setFillColor(HexColor(LIGHT));self.c.rect(44,self.y-rh+7,524,rh,fill=1,stroke=0)
        for h,w in zip(heads,widths):self.text(x+7,self.y-12,h,10,True);x+=w
        self.y-=rh
        for row in rows:
            x=44
            for s,w in zip(row,widths):self.text(x+7,self.y-12,str(s),10);x+=w
            self.c.setStrokeColor(HexColor('#D4DFDA'));self.c.line(44,self.y-22,568,self.y-22);self.y-=rh
        self.y-=18
    def items(self,items,start=1,gap=43):
        for i,s in enumerate(items,start):
            self.text(44,self.y,f'{i}.  {s}',11); self.y-=gap
    def save(self):self.c.save()

reg=Book(OUT/'module-1-regular-verbs.pdf','Module 1 • Regular verbs')
reg.page('Build a verb in three moves','VISUAL GUIDE  •  Keep this page beside you as you practice.')
reg.lines(['Conjugation means changing a verb so it matches who does the action.',
           'An infinitive is the starting form: hablar = to speak. Present tense describes',
           'what happens now or regularly: hablo = I speak / I am speaking.'])
for x,num,head,example in [(44,'1','Choose who','yo = I'),(222,'2','Remove -ar','hablar → habl-'),(400,'3','Add the ending','habl- + o = hablo')]:
    reg.c.setFillColor(HexColor(LIGHT));reg.c.roundRect(x,496,168,72,8,fill=1,stroke=0)
    reg.text(x+12,546,num+'  '+head,11,True,TEAL);reg.text(x+12,518,example,11)
reg.y=468;reg.table(['Who?','-ar','-er','-ir'],[[P[i]]+[E[g][i] for g in E] for i in range(5)])
reg.lines(['hablar → hablo     comer → como     vivir → vivo',
           'tú = you (one person, informal); usted = you (one person, formal).',
           'Usted uses the él/ella form. Ustedes (you all) uses the ellos/ellas form.',
           'Nosotros/nosotras = we. Ellos/ellas = they. Gender does not change the verb.',
           'A name works too: Ana = ella; Ana y yo = nosotros; Ana y Luis = ellos.',
           'Spanish often leaves out the subject: Hablo español. = I speak Spanish.'],10,19)
reg.title('Quick self-check');reg.lines(['Who is doing it?  →  Which verb family?  →  Which ending?', 'Use the same stem for every form of these regular verbs.'],11)

reg.page('01 / Find the pieces','WORKSHEET A  •  Name: ____________________  Date: ______________')
reg.title('A. Match the subject');reg.lines(['Write yo, tú, él/ella/usted, nosotros/nosotras, or ellos/ellas/ustedes.'])
reg.items(['I: ____________________','you all: ____________________','Marta: ____________________','Luis and I: ____________________'],gap=35)
reg.title('B. Separate stem and ending');reg.lines(['Example: hablar → habl- + -ar'])
reg.items(['estudiar → ______________ + ______________','comer → ______________ + ______________','vivir → ______________ + ______________'],5,gap=40)
reg.title('C. Build the form');reg.lines(['Example: yo + hablar → habl- + o → hablo'])
reg.items(['tú + hablar → habl- + ______ → __________________', 'nosotros + comer → com- + ______ → __________________', 'ellas + vivir → viv- + ______ → __________________'],8,gap=43)
reg.lines(['Say your steps out loud: “Who? Family? Ending?”'],10)

reg.page('02 / Practice the pattern','WORKSHEET B  •  Use the guide first. Try the last four without it.')
reg.title('A. Complete each mini-chart')
reg.table(['Who?','hablar','comer','vivir'],[[P[i],'________','________','________'] for i in [0,1,3,4]])
reg.title('B. Write the matching present-tense form')
reg.items(['ella / estudiar (to study): ____________________','ustedes / beber (to drink): ____________________','yo / escribir (to write): ____________________','tú / aprender (to learn): ____________________','nosotras / bailar (to dance): ____________________','él / abrir (to open): ____________________','ellos / leer (to read): ____________________','usted / escuchar (to listen): ____________________'],gap=39)
reg.lines(['Tip: -er and -ir share endings here except in nosotros: -emos / -imos.'],10)

reg.page('03 / Use it and check it','WORKSHEET C  •  Try independently, then use the answer key together.')
reg.title('A. Complete the sentence');reg.lines(['The infinitive and its English meaning are in parentheses.'])
reg.items(['Yo __________ español. (hablar = to speak)','Tú __________ agua. (beber = to drink)','Ana __________ en México. (vivir = to live)','Luis y yo __________ música. (escuchar = to listen)','Mis amigos __________ libros. (leer = to read)','Usted __________ la puerta. (abrir = to open)'],gap=37)
reg.title('B. Fix the verb and explain why')
reg.items(['Yo hablas. → ____________________','Nosotros viven. → ____________________'],7,gap=41)
reg.lines(['Why? __________________________________________________________'])
reg.title('C. Make it your own');reg.lines(['Write one true sentence starting with Yo and one starting with Nosotros.', 'Use hablar, estudiar, comer, beber, vivir, or escribir.'])
reg.lines(['________________________________________________________________', '________________________________________________________________'],11,31)
reg.lines(['Ready for Module 2? Aim for 7/8 on A + B without the guide twice,', 'on different days. If needed, repeat a few items with different subjects.'],10)
reg.save()

irr=Book(OUT/'module-2-irregular-verbs.pdf','Module 2 • Irregular verbs')
irr.page('Small groups, useful patterns','VISUAL GUIDE  •  Use Module 1 first. Learn one group at a time.')
irr.lines(['An irregular verb changes in a way the regular ending chart cannot predict.', 'Keep asking “who?” Learn the special part, then practice it in a short sentence.'])
irr.title('1 / Four useful verbs')
irr.table(['Who?','ser','estar','ir','tener'],[[P[i]]+[LOOK[v]['forms'][i] for v in ['ser','estar','ir','tener']] for i in range(5)],[172,88,88,88,88])
irr.lines(['ser = to be: identity / traits → Soy estudiante. (I am a student.)', 'estar = to be: location / state → Estoy en casa. (I am at home.)', 'These are starting uses, not a permanent-versus-temporary rule.', 'ir = to go → Vamos a clase. (We go to class.)', 'tener = to have → Tengo un libro. (I have a book.)'],10,17)
irr.title('2 / Special yo forms');irr.lines(['hacer = to do/make → hago; poner = to put → pongo.', 'Other forms here follow -er endings: haces, hace, hacemos, hacen.'],10,17)
irr.title('3 / A vowel changes in the stem');irr.lines(['querer (to want): e → ie; quiero, quieres, quiere, queremos, quieren.', 'poder (to be able to): o → ue; puedo, puedes, puede, podemos, pueden.', 'pedir (to ask for): e → i; pido, pides, pide, pedimos, piden.', 'In these present-tense patterns, nosotros keeps the original stem vowel.', 'Tener mixes patterns: tengo + tienes/tiene/tienen, but tenemos.'],10,18)

irr.page('01 / Learn the essential four','WORKSHEET A  •  First read the chart, cover it, then recall one row at a time.')
irr.title('A. Choose the correct form');irr.lines(['Circle the form that matches the subject.'])
irr.items(['yo / ser:     soy     eres     somos','tú / estar:     está     están     estás','nosotros / ir:     van     vamos     voy','ellos / tener:     tengo     tienes     tienen'],gap=38)
irr.title('B. Write the form of the verb given');irr.lines(['Focus on matching the subject. You do not need to choose ser or estar.'])
irr.items(['Yo __________ estudiante. (ser)','Ella __________ en casa. (estar)','Ustedes __________ a clase. (ir)','Tú __________ un libro. (tener)','Nosotras __________ amigas. (ser)','Nosotros __________ en la escuela. (estar)','Yo __________ al parque. (ir)','Él __________ una bicicleta. (tener)'],5,gap=35)
irr.lines(['Accent check: estás, está, están. Copy the accents carefully.'],10)

irr.page('02 / Notice what changes','WORKSHEET B  •  Learn the pattern, then compare with nosotros.')
irr.title('A. Special yo, familiar endings')
irr.items(['yo / hacer: ____________________','ella / hacer: ____________________','yo / poner: ____________________','nosotros / poner: ____________________'],gap=35)
irr.title('B. Pair the changed stem with nosotros')
irr.table(['Verb','yo','nosotros'],[['querer (to want)','____________','____________'],['poder (to be able to)','____________','____________'],['pedir (to ask for)','____________','____________']],[180,172,172])
irr.title('C. Explain it')
irr.items(['Why is it queremos, not quieremos?'],5,gap=30)
irr.lines(['__________________________________________________________'])
irr.items(['Tú / poder: __________    Ellas / pedir: __________'],6,gap=38)
irr.lines(['Memory cue: a changed stem in yo, tú, él/ella/usted, and ellos/ellas/ustedes;', 'an unchanged stem vowel in nosotros for these stem-changing patterns.'],10)

irr.page('03 / Mix, recall, repeat','WORKSHEET C  •  Try without the chart. Revisit missed forms tomorrow.')
irr.title('A. Complete with the verb given')
irr.items(['Yo __________ la tarea. (hacer = to do/make)','Tú __________ ir al parque. (querer = to want)','Nosotros __________ jugar. (poder = to be able to)','Ellas __________ ayuda. (pedir = to ask for)','Yo __________ el libro en la mesa. (poner = to put)','Usted __________ en clase. (estar = to be)','Mis amigos __________ a la escuela. (ir = to go)','Nosotras __________ dos libros. (tener = to have)'],gap=35)
irr.title('B. Correct the verb')
irr.items(['Yo teno. → ____________________','Nosotros puedemos. → ____________________'],9,gap=37)
irr.title('C. One sentence, one explanation')
irr.lines(['Write a sentence with soy, estoy, voy, or tengo.', '________________________________________________________________', 'Explain one irregular pattern in your own words.', '________________________________________________________________'],11,28)
irr.lines(['Check A + B out of 10. Aim for 8/10 twice on different days.', 'Keep practicing any missed forms in the app; no speed goal is needed.'],10)
irr.save()

key=Book(OUT/'parent-guide-and-answer-key.pdf','Parent guide + answer keys')
key.page('Ten minutes, one small win','PARENT GUIDE  •  Keep answer pages separate from the student worksheets.')
key.title('A repeatable practice routine')
key.lines(['1. Recall (2 min): ask what yo, tú, nosotros, and ustedes mean.', '2. Model (2 min): do one verb together; say each step out loud.', '3. Try (4 min): complete a short worksheet section or an app round.', '4. Review (2 min): explain one mistake, then retry it with the guide covered.'],11,23)
key.title('Suggested path, at his pace')
key.lines(['Sessions 1-2: Module 1 guide + Worksheet A.', 'Sessions 3-4: Module 1 Worksheet B; practice -ar, then -er/-ir in the app.', 'Sessions 5-6: Module 1 Worksheet C and a mixed regular round.', 'Then: Module 2 essential four; special yo forms; stem changes; mixed recall.', 'Use the readiness targets as practice goals, not grades or requirements.'],11,23)
key.title('When he gets stuck')
key.lines(['Wrong ending? Ask him to point to the subject row before writing.', 'Wrong stem? Ask him to circle the infinitive ending and remove only that part.', 'Irregular verb? Ask which small group it belongs to and what changes.', 'A correct answer with a missing accent still needs an accent reminder.', 'Praise a useful strategy: “You checked nosotros before choosing the ending.”'],11,23)
key.title('Scope and classroom fit')
key.lines(['These materials cover the present indicative, using Latin American subjects.', 'Vosotros is not used in the core lessons. Other tenses and vos are not covered.', 'The irregular module is a starter set, not every irregular verb in Spanish.', 'Check his teacher’s verb list and pacing; these materials can be adjusted.', 'Spanish nouns are simple on purpose: the task is conjugation, not translation.'],11,22)
key.title('App progress')
key.lines(['Practice is untimed. Hints and explanations support learning.', 'Round scores count first tries, including tries after a hint. Missed items can be', 'retried separately. Practice totals stay in this browser and can be reset.'],11,20)

key.page('Module 1 / Answers','Use the explanation prompts to discuss mistakes without turning practice into a test.')
key.title('Worksheet A / Find the pieces')
key.lines(['1 yo; 2 ellos/ellas/ustedes (ustedes is most direct); 3 él/ella/usted (ella);', '4 nosotros/nosotras (nosotros or nosotras for a group including the speaker).', '5 estudi- + -ar; 6 com- + -er; 7 viv- + -ir.', '8 as → hablas; 9 emos → comemos; 10 en → viven.'],11,22)
key.title('Worksheet B / Practice the pattern')
key.table(['Subject','hablar','comer','vivir'],[['yo','hablo','como','vivo'],['tú','hablas','comes','vives'],['nosotros','hablamos','comemos','vivimos'],['ellos','hablan','comen','viven']])
key.lines(['B1 estudia; B2 beben; B3 escribo; B4 aprendes;', 'B5 bailamos; B6 abre; B7 leen; B8 escucha.'],11,22)
key.title('Worksheet C / Use it and check it')
key.lines(['1 hablo; 2 bebes; 3 vive; 4 escuchamos; 5 leen; 6 abre.', '7 Yo hablo. Yo needs -o, not the tú ending -as.', '8 Nosotros vivimos. Nosotros needs -imos for vivir, not -en.', 'C sample answers: Yo estudio español. Nosotros bebemos agua.', 'Accept other meaningful sentences with correctly matched regular verbs.'],11,22)
key.title('What counts as correct?')
key.lines(['The verb must match the subject. Nosotras uses the same form as nosotros.', 'Usted uses the third-person singular form; ustedes uses the plural form.', 'Spanish may omit yo/nosotros in free writing; accept a clear correct verb.', 'Accents in supplied subject words (tú, él) should be copied accurately.'],11,22)

key.page('Module 2 / Answers','Have him say the subject and explain the special change before looking here.')
key.title('Worksheet A / Learn the essential four')
key.lines(['1 soy; 2 estás; 3 vamos; 4 tienen.', '5 soy; 6 está; 7 van; 8 tienes; 9 somos; 10 estamos; 11 voy; 12 tiene.'],11,23)
key.title('Worksheet B / Notice what changes')
key.lines(['A1 hago; A2 hace; A3 pongo; A4 ponemos.'],11,22)
key.table(['Verb','yo','nosotros'],[['querer','quiero','queremos'],['poder','puedo','podemos'],['pedir','pido','pedimos']])
key.lines(['C5: Nosotros keeps the original stem vowel in this present-tense pattern.', 'C6: puedes; piden.'],11,22)
key.title('Worksheet C / Mix, recall, repeat')
key.lines(['1 hago; 2 quieres; 3 podemos; 4 piden; 5 pongo; 6 está; 7 van; 8 tenemos.', '9 Yo tengo. Tener has the special yo form tengo.', '10 Nosotros podemos. The stem vowel does not change in nosotros here.', 'C sample sentences: Soy estudiante. Estoy en casa. Voy a clase.', 'Tengo un libro. Accept other meaningful, correctly conjugated sentences.', 'Sample explanation: “Poder changes o to ue, but nosotros is podemos.”'],11,23)
key.title('Useful distinctions')
key.lines(['Ser and estar both mean “to be”; their uses go beyond this starter guide.', 'Do not teach them as a strict permanent/temporary split.', 'Tener is mixed: tengo, tienes, tiene, tenemos, tienen.', 'The nosotros stem reminder here applies to these present-tense patterns;', 'other tenses can behave differently.'],11,22)
key.save()
print(f'Created 3 foundation PDFs in {OUT}. App data was not modified.')
