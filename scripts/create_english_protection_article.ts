import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (!user) {
        console.error('No admin user found!');
        return;
    }

    console.log(`Found admin user: ${user.email}`);

    // Check for both old and new slugs to clean up
    const slugsToDelete = [
        'analisis-historico-efectividad-proteccion-ejecutiva-en',
        'historical-analysis-effectiveness-executive-protection'
    ];

    for (const slug of slugsToDelete) {
        const existing = await prisma.blogPost.findUnique({ where: { slug } });
        if (existing) {
            console.log(`Deleting existing post with slug: ${slug}`);
            await prisma.blogPost.delete({ where: { slug } });
        }
    }

    const spanishPost = await prisma.blogPost.findUnique({
        where: { slug: 'analisis-historico-efectividad-proteccion-ejecutiva' },
        select: { image: true }
    });

    const articleContent = `
<h2>Introduction</h2>
<p>In contemporary practice, both protectors and protectees often assume that firearms constitute the central element of executive protection. This perception persists despite the absence of robust empirical evidence to support it. Part of this view stems from cultural narratives, especially cinema, fiction, and isolated anecdotes. Scientifically evaluating the effectiveness of these tools is complex due to the lack of systematic data. For example, in Mexico alone, INEGI reports 2,877 executives and officials assassinated in recent decades, but there is no complete information on how many had armed security, nor in how many cases their agents could influence the outcome. On a global scale, an exhaustive census is unfeasible.</p>
<p>Therefore, this study adopts a representative sample: <strong>141 historically verifiable assassination attempts with confirmed presence of professional armed security</strong>. Multiple sources—encyclopedic databases, academic archives, and journalistic reports—were used to ensure historical precision and consistency.</p>

<h2>Methodology</h2>
<h3>2.1 Case Selection</h3>
<p>The 141 cases were selected following strict criteria:</p>
<ul>
<li><strong>Universality:</strong> more than 60 countries.</li>
<li><strong>Verifiability:</strong> cases documented and widely recorded in historical sources.</li>
<li><strong>Temporal significance:</strong> over 125 years of observation.</li>
<li><strong>Quality of protection:</strong> victims with official, armed, and professional security.</li>
<li><strong>Relevance of position:</strong> heads of state, prime ministers, princes, high officials, presidential candidates, etc.</li>
<li><strong>Exclusion:</strong> kidnappings and undocumented assaults due to lack of comparable operational data.</li>
</ul>
<p>These criteria ensure that the study observes only situations with a high standard of protection, reducing the possibility of attributing failures to improvisation or structural incompetence.</p>

<h3>2.2 Analysis Categories</h3>
<p>The assassination attempts were classified as:</p>
<ul>
<li>Non-fatal attempts (74 cases)</li>
<li>Consummated assassinations (67 cases)</li>
</ul>
<p>Effectiveness evaluation considers a measure as decisive only when its application directly ensures the protectee's survival, without relying on luck or attacker errors.</p>

<h3>2.3 Circumstantial Effectiveness Index (CEI)</h3>
<p>The CEI is defined as:</p>
<p><strong>CEI = (Number of cases where the measure was decisive / Number of applicable cases) × 100</strong></p>
<p><strong>Applicable cases:</strong> situations where the tool could reasonably intervene based on distance, attack type, and operational context.</p>
<p>Estimated distances:</p>
<ul>
<li>Short (<7 m): 93 cases (65.96%).</li>
<li>Long (>7 m): 48 cases.</li>
</ul>
<p>Distance was determined through historical reconstructions, official descriptions, and reports from the scene.</p>

<h3>2.4 Data Verification</h3>
<p>Each case was corroborated across multiple sources. Examples:</p>
<ul>
<li>Early 20th century: attacks on Edward of Wales (1900), Leopold II (1902).</li>
<li>Successful manual reaction: Lenin (1918), Mussolini (1926), Reagan (1981)</li>
<li>Failures with large teams: Galán (1989, 18 escorts), Cabrera Barrientos (2024, 15 escorts), Carlos Manzo (2025, ~20 escorts).</li>
</ul>
<p>No significant contradictions were found among consulted sources.</p>

<h2>Results</h2>
<h3>3.1 General Overview</h3>
<ul>
<li>Non-fatal attempts: 74 (52.48%)</li>
<li>Consummated assassinations: 67 (47.52%)</li>
</ul>

<h3>3.2 Effectiveness by Measure</h3>
<h4>Firearms</h4>
<ul>
<li>Global CEI: <strong>3.55%</strong> (5/141)</li>
<li>At short distance (<7 m): <strong>0%</strong> (0/93)</li>
<li>At long distance (>7 m): <strong>10.42%</strong> (5/48)</li>
</ul>
<p>In most cases, the attack occurs too quickly for an effective armed response. Nonetheless, the few successful cases show that weapons should not be discarded at all but placed in their real context: a low-performance and secondary tool.</p>

<h4>Empty-Hand Techniques</h4>
<ul>
<li>CEI: <strong>32.61%</strong> (15/46 applicable cases)</li>
</ul>
<p>They work primarily against lone attackers in crowds and at extremely short distances. Useful resource in immediate contact scenarios.</p>

<h4>Armored Vehicles and Defensive Driving</h4>
<ul>
<li>CEI: <strong>100%</strong> (5/5)</li>
</ul>
<p>Armored vehicles stand out as one of the few measures with absolute performance when conditions allow their application. Emblematic cases: De Gaulle 1961–62, Aznar 1995, Shevardnadze 1998.</p>

<h4>Cumulative Effectiveness of Close Protection Measures</h4>
<ul>
<li><strong>17.73%</strong> combined effectiveness</li>
</ul>
<p>(Includes weapons, empty hands, armored vehicles, and immediate reaction devices.) This implies that over 80% of attacks overcame traditional close protection schemes, even in robust and highly trained teams. Critical examples:</p>
<ul>
<li>Luis Carlos Galán (1989) with 18 armed agents.</li>
<li>Cabrera Barrientos (2024) with 15 federal agents.</li>
<li>Carlos Manzo (2025) with ~20 agents from Guardia Nacional and federal police.</li>
</ul>
<p>The size of the operation does not compensate for preventive deficiencies.</p>

<h4>Anticipatory Measures (Historically Underutilized)</h4>
<p><strong>Early Warning</strong> Decisive in one of the few documented cases of structured application:</p>
<ul>
<li>Donald Trump, September 2024.</li>
</ul>

<h2>The Critical Omission: Anticipatory Protection</h2>
<p>The study reveals that, over 125 years, Executive Protection has been dominated by:</p>
<ul>
<li>weapons,</li>
<li>reaction,</li>
<li>physical presence,</li>
<li>large number of agents.</li>
</ul>
<p>However, historical analysis shows that: Most attackers conducted prior surveillance, sometimes:</p>
<ul>
<li>days,</li>
<li>weeks,</li>
<li>months before.</li>
</ul>
<p>This was evident in:</p>
<ul>
<li>Both attacks on Donald Trump (2024)</li>
<li>Dozens of planned ambushes from 1900 to today.</li>
</ul>
<p>In no reviewed case is the systematic implementation of professional counter-surveillance documented, despite being one of the most effective methods in modern security theory. <strong>The historical absence of anticipatory detection constitutes the main structural cause of failure in the traditional executive protection system.</strong></p>

<h2>Discussion</h2>
<p>The results align with contemporary operational findings, such as:</p>
<ul>
<li>The Tueller Drill, which demonstrates that an attacker at short distance systematically overcomes armed reaction speed that explains low effectiveness of firearms in short distance attacks.</li>
<li>Cases like Sadat (1981) and Galán (1989) prove that even a large deployment becomes irrelevant without anticipation.</li>
<li>The success of early warning in September 2024 shows the difference between a reactive and an anticipatory model.</li>
</ul>

<h3>Limitations</h3>
<ul>
<li>The study excludes undocumented events.</li>
<li>The CEI describes contextual effectiveness, not absolute.</li>
<li>Future research can expand the database and employ operational simulations.</li>
</ul>

<h2>Conclusion</h2>
<p>The data are unequivocal:</p>
<ul>
<li><strong>Firearms are not the central measure of executive protection.</strong> With 3.55% historical effectiveness, their utility is marginal and should be understood as a complementary resource, not structural.</li>
<li><strong>Anticipatory prevention is the key to the future.</strong> The analysis suggests that up to 80% of assassination attempts could have been thwarted with a systematic combination of:
    <ul>
    <li>Counter-surveillance / surveillance detection</li>
    <li>Early warning</li>
    <li>Protective logistics</li>
    </ul>
</li>
<li><strong>Reactive measures are insufficient.</strong> The combined effectiveness of 17.73% demonstrates that reaction is late in most contexts.</li>
<li><strong>21st Century Executive Protection must be:</strong>
     <ul>
    <li>Intelligence-enabled,</li>
    <li>Predictive,</li>
    <li>Logistical,</li>
    <li>Based on anticipation, not armament.</li>
    </ul>
</li>
</ul>

<h2>Consolidated List of Cases (1–141)</h2>
<p>The following list includes all 141 cases in the order presented in the original dataset, renumbered sequentially for clarity. Attempts (1–74) are non-fatal; consummated (75–141) are fatal. Annotations indicate decisive factors where applicable.</p>

<ol>
<li>Edward, Prince of Wales – 1900</li>
<li>Leopold II, King of Belgium – 1902</li>
<li>Alfonso XIII, King of Spain – 1906</li>
<li>Theodore Roosevelt, U.S. presidential candidate – 1912</li>
<li>Lenin – 1918 (attacker subdued using empty hands)</li>
<li>Georges Clemenceau, Prime Minister of France – 1919</li>
<li>Benito Mussolini, Leader of Fascist Italy – April 1926 (attacker subdued using empty hands)</li>
<li>Benito Mussolini, Leader of Fascist Italy – May 1926 (attacker subdued using empty hands)</li>
<li>Herbert Hoover, President of the U.S. – 1928</li>
<li>Franklin D. Roosevelt, President of the U.S. – 1933 (attacker subdued using empty hands)</li>
<li>Keisuke Okada, Prime Minister of Japan – 1936</li>
<li>Mohammad Reza Pahlavi, Shah of Iran – 1949</li>
<li>Harry Truman, President of the United States – 1950 (firearms were decisive)</li>
<li>Prince Hussein, Prince of Jordan – 1960</li>
<li>Konrad Adenauer, German Chancellor – 1952</li>
<li>Hendrik Verwoerd, Prime Minister of South Africa – 1960 (attacker subdued with empty hands)</li>
<li>Charles De Gaulle, President of France – 1961 (vehicle handling was decisive)</li>
<li>Charles De Gaulle, President of France – 1962 (vehicle handling was decisive)</li>
<li>Georgios Papadopoulos, President of Greece – 1968</li>
<li>Leonid Brezhnev, General Secretary of the Soviet Union – 1969</li>
<li>George Wallace, U.S. Presidential Candidate – 1972</li>
<li>Anne, Princess of England – 1974</li>
<li>Sukarno, President of Indonesia – 1962</li>
<li>Gerald Ford, President of the United States – 1975 (attacker subdued with empty hands)</li>
<li>Elizabeth II, Queen of England – 1981</li>
<li>Pope John Paul II – 1981 (attacker subdued with empty hands)</li>
<li>Ronald Reagan, President of the United States – 1981 (attacker subdued using empty hands)</li>
<li>Chun Doo Hwan, President of South Korea – 1983</li>
<li>Margaret Thatcher, British Prime Minister – 1984</li>
<li>Augusto Pinochet, President of Chile – 1986 (firearms were decisive)</li>
<li>Wolfgang Schäuble, German Interior Minister – 1990 (attacker subdued using empty hands)</li>
<li>John Major, Prime Minister of the United Kingdom – 1991 (armored windows were decisive)</li>
<li>Eduard Shevardnadze, President of Georgia – 1992</li>
<li>Eduard Shevardnadze, President of Georgia – 1995</li>
<li>Hosni Mubarak, President of Egypt – 1995 (firearms were decisive)</li>
<li>Kiro Gligorov, President of Macedonia – 1995</li>
<li>José María Aznar, Spanish politician and former Prime Minister – 1995 (armored vehicle and attacker failures were decisive)</li>
<li>Charles, Prince of Wales – 1995</li>
<li>Eduard Shevardnadze, President of Georgia – 1998 (armored vehicle was decisive)</li>
<li>Jacques Chirac, President of France – 2002 (attacker subdued with empty hands)</li>
<li>Hamid Karzai, President of Afghanistan – 2002 (firearms were decisive)</li>
<li>Pervez Musharraf, President of Pakistan – 2003</li>
<li>Murat Zyazikov, President of Ingushetia – 2004</li>
<li>Shaukat Aziz, Prime Minister of Pakistan – 2004</li>
<li>Sheikh Hasina, Prime Minister of Bangladesh – 2004</li>
<li>Ibrahim Rugova, President of Kosovo – 2005</li>
<li>Pervez Musharraf, President of Pakistan – 2007</li>
<li>George W. Bush, President of the United States and Mikheil Saakashvili, President of Georgia – 2005</li>
<li>Abdullahi Yusuf Ahmed, President of Somalia – 2006</li>
<li>Gotabaya Rajapaksa, Secretary of Defense of Sri Lanka – 2006</li>
<li>Dick Cheney, Vice President of the United States – 2007</li>
<li>Guillaume Soro, Prime Minister of Côte d'Ivoire – 2007</li>
<li>Abdul Gayoom, President of Maldives – 2008 (attacker subdued using empty hands)</li>
<li>José Ramos Horta, President of East Timor – 2008</li>
<li>Queen Beatrix, Queen of the Netherlands – 2009</li>
<li>Yunus-Bek Yevkurov, Leader of Ingushetia – 2009</li>
<li>Stephen Timms, British Labour MP – 2010</li>
<li>Ali Abdullah Saleh, President of Yemen – 2011</li>
<li>Alpha Condé, President of Guinea – 2011 (firearms were decisive)</li>
<li>Abdul Ghafoor Haideri, Pakistani Senate Leader – 2017</li>
<li>Nicolás Maduro, President of Venezuela – 2018</li>
<li>Omar García Harfuch, Mexico City Police Chief – 2020</li>
<li>Iván Duque, President of Colombia – 2021</li>
<li>Assimi Goïta, President of Mali – 2021 (attacker subdued with empty hands)</li>
<li>Aleksandar Vučić, President of Serbia – 2022</li>
<li>Cristina Fernández de Kirchner, Vice President of Argentina – 2022</li>
<li>Emmanuel Macron, President of France – 2023 (attacker subdued with empty hands)</li>
<li>Fumio Kishida, Prime Minister of Japan – 2023 (attacker subdued with empty hands)</li>
<li>Lee Jae-myung, Opposition Leader in South Korea – 2024</li>
<li>Robert Fico, Prime Minister of Slovakia – 2024</li>
<li>Donald Trump, Former U.S. President – July 2024</li>
<li>Donald Trump, Former U.S. President – September 2024 (early warning was decisive)</li>
<li>Daniel Uribe – 2025 (firearms were not effective)</li>
<li>Serhiy Sternenko, Ukrainian Activist – 2025 (empty hands were decisive)</li>
<li>William McKinley, President of the United States – 1901</li>
<li>Franz Ferdinand, Archduke of Austria – 1914</li>
<li>Sidónio Pais, President of Portugal – 1918</li>
<li>Michael Collins, Irish Revolutionary Leader – 1922</li>
<li>Ahmet Muhtar Zogolli – 1924</li>
<li>Alexander I, King of Yugoslavia – 1939</li>
<li>Walter Edward Guinness, Lord Moyne, UK Minister in the Middle East – 1944</li>
<li>Ahmad Mahar Pasha, Prime Minister of Egypt – 1945</li>
<li>Mahmud Fahmi Nokrashi, Prime Minister of Egypt – 1948</li>
<li>Abdullah I, King of Jordan – 1951</li>
<li>José Antonio Remón Cantera, President of Panama – 1955</li>
<li>Hendrik Verwoerd, Prime Minister of South Africa – 1960</li>
<li>Hazza al-Majali, Prime Minister of Jordan – 1960</li>
<li>Louis Rwagasore, Prime Minister of Burundi – 1961</li>
<li>John F. Kennedy, President of the United States – 1963</li>
<li>Joseph Bamina, Prime Minister of Burundi – 1965</li>
<li>Hendrik Frensch Verwoerd, President of South Africa – 1966</li>
<li>Robert F. Kennedy, U.S. Attorney General – 1968</li>
<li>Martin Luther King, African-American Activist – 1968</li>
<li>Abdirashid Ali Sharmarke, President of Somalia – 1969</li>
<li>Wasfi al-Tal, Prime Minister of Jordan – 1971</li>
<li>Abdul Rahman, Inspector General of Police of Malaysia – 1974</li>
<li>François Tombalbaye, President of Chad – 1975</li>
<li>Sheikh Mujibur Rahman, President of Bangladesh – 1975</li>
<li>Murtala Muhammed, Head of State of Nigeria – 1976</li>
<li>Hans Martin Schleyer, German Business Leader – 1977</li>
<li>Marien Ngouabi, President of Congo – 1977</li>
<li>Ahmad bin Hussein al-Ghashmi, President of the Republic of Yemen – 1978</li>
<li>Aldo Moro, Former Prime Minister of Italy – 1978</li>
<li>Park Chung Hee, President of South Korea – 1979</li>
<li>Lord Louis Mountbatten, British Diplomat and Royal Navy Officer – 1979</li>
<li>William Richard Tolbert, President of Liberia – 1980</li>
<li>Anwar el-Sadat, Prime Minister of Egypt – 1981</li>
<li>Ziaur Rahman, President of Bangladesh – 1981</li>
<li>Bachir Gemayel, President-Elect of Lebanon – 1982</li>
<li>Mohammad Ali Rajai, President of Iran – 1981</li>
<li>Indira Gandhi, Prime Minister of India – 1984</li>
<li>Rodrigo Lara Bonilla, Minister of Justice of Colombia – 1984</li>
<li>Thomas Sankara, President of Burkina Faso – 1987</li>
<li>Carlos Mauro Hoyos, Attorney General of Colombia – 1988</li>
<li>Luis Carlos Galán, Colombian Presidential Candidate – 1989</li>
<li>James N. Rowe, U.S. Military Advisor – 1989</li>
<li>Waldemar Franklin Quintero, Commander of the Antioquia Police, Colombia – 1989</li>
<li>Alfred Herrhausen, CEO of Deutsche Bank – 1989</li>
<li>Samuel Doe, President of Liberia – 1990</li>
<li>Bernardo Jaramillo Ossa, Presidential Candidate, Leader of the Patriotic Union Party – 1990</li>
<li>Rajiv Gandhi, Indian Politician – 1991</li>
<li>Giovanni Falcone, Anti-Mafia Judge – 1992</li>
<li>Melchior Ndadaye, President of Burundi – 1993</li>
<li>Luis Donaldo Colosio, Mexican Presidential Candidate – 1994</li>
<li>Juvénal Habyarimana, President of Rwanda – 1994</li>
<li>Yitzhak Rabin, Prime Minister of Israel – 1995</li>
<li>Vazgen Sargsyan, Prime Minister of Armenia – 1999</li>
<li>Luis María Argaña, Vice President of Paraguay – 1999</li>
<li>Zoran Đinđić, Prime Minister of Serbia – 2003</li>
<li>João Bernardo Vieira, President of Guinea – 2009</li>
<li>Benazir Bhutto, Former Prime Minister of Pakistan – 2007</li>
<li>Ali Abdullah Saleh, President of Yemen – 2017</li>
<li>Alexander Zakharchenko, President of the Donetsk Republic – 2018</li>
<li>Aristóteles Sandoval, Former Governor of the State of Jalisco – 2020</li>
<li>Jovenel Moïse, President of Haiti – 2021</li>
<li>Shinzo Abe, Former Prime Minister of Japan – 2022</li>
<li>Atiq Ahmed, Former Prime Minister of India – 2023</li>
<li>Fernando Villavicencio, Ecuadorian Presidential Candidate – 2023</li>
<li>José Alfredo Cabrera Barrientos, Candidate for Mayor of Coyuca de Benítez, Guerrero, Mexico – 2024 (protected with 15 heavily armed federal escorts)</li>
<li>Charlie Kirk, American Activist – 2025</li>
<li>Carlos Manzo, Alcalde de Uruapan, México – 2025 (Assassinated at close range despite being accompanied by approximately 20 Mexican National Guard and Federal Police bodyguards; the protection detail failed.)</li>
</ol>

<h2>References</h2>
<ol>
<li>Exploring factors in successful vs. unsuccessful terrorist assassinations. START. <a href="#" target="_blank">Link</a></li>
<li>Assassination of political leaders: The role of social conflict. ScienceDirect. <a href="#" target="_blank">Link</a></li>
<li>"A Study of Assassination"-Transcription. National Security Archive. <a href="#" target="_blank">Link</a></li>
<li>Distance and Threats – An Unpublished Section from "Left of Bang". CP Journal. <a href="#" target="_blank">Link</a></li>
<li>Hit or Miss? The Effect of Assassinations on Institutions and War. Kellogg School of Management. <a href="#" target="_blank">Link</a></li>
<li>Analysis - Faces of Assassination. Global Initiative. <a href="#" target="_blank">Link</a></li>
<li>Are assassination attempts getting more common? Vox. <a href="#" target="_blank">Link</a></li>
<li>Instituto Nacional de Estadística y Geografía (INEGI) data on assassinations in Mexico. (Internal reference from study methodology).</li>
<li>Political leader assassination attempts are on the rise worldwide. The Hub. <a href="#" target="_blank">Link</a></li>
<li>Gunman was a few hundred feet away from Trump, CNN analysis. CNN. <a href="#" target="_blank">Link</a></li>
<li>Assassination of Miguel Uribe Turbay. Wikipedia. <a href="#" target="_blank">Link</a></li>
<li>Assassination of Charlie Kirk. Wikipedia. <a href="#" target="_blank">Link</a></li>
<li>Notable Ukrainian activist injured in apparent assassination attempt. Euronews. <a href="#" target="_blank">Link</a></li>
<li>List of United States presidential assassination attempts and plots. Wikipedia. <a href="#" target="_blank">Link</a></li>
<li>Charlie Kirk shooting: A timeline of recent political violence in America. ABC News. <a href="#" target="_blank">Link</a></li>
<li>How recent political violence in the U.S. fits into 'a long, dark history'. PBS. <a href="#" target="_blank">Link</a></li>
<li>List of people who survived assassination attempts. Wikipedia. <a href="#" target="_blank">Link</a></li>
<li>List of assassinated persons. Wikipedia. <a href="#" target="_blank">Link</a></li>
</ol>
`;

    await prisma.blogPost.create({
        data: {
            title: 'Historical Analysis of the Effectiveness of Executive Protection Measures: A Study of 141 Assassination Attempts Against Public Figures (1900–2025)',
            slug: 'historical-analysis-effectiveness-executive-protection',
            excerpt: 'This study evaluates the historical effectiveness of executive protection measures through 141 verified assassination attempts. Results show reactive measures have only 17.73% effectiveness, while anticipatory strategies demonstrate significantly higher potential.',
            content: articleContent,
            image: spanishPost?.image || '/images/blog/executive-protection.jpg',
            published: true,
            language: 'en',
            authorId: user.id,
            pinned: false
        }
    });

    console.log('✅ English article created successfully!');
    console.log('📝 Slug: historical-analysis-effectiveness-executive-protection');
    console.log('🌐 URL: /blog/historical-analysis-effectiveness-executive-protection');
}

main()
    .catch((e) => {
        console.error('Error creating English article:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
