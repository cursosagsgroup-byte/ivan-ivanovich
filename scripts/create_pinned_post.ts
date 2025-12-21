
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TITLE = "Análisis Histórico de la Efectividad de las Medidas de Protección Ejecutiva: Un Estudio de 141 Intentos de Asesinato Contra Figuras Públicas (1900–2025)";
const SLUG = "analisis-historico-efectividad-proteccion-ejecutiva";
const IMAGE_URL = "https://ivanivanovich.com/wp-content/uploads/2025/02/analisis-historico-efectividad.jpg"; // Placeholder URL relative to site if using local, but usually we use absolute or relative. Let's use the path to the file we copied.
// Actually, for the site to serve it, it should be /images/blog/analisis-historico-efectividad.jpg
const IMAGE_PATH = "/images/blog/analisis-historico-efectividad.jpg";

const CONTENT = `
<h2>Resumen</h2>
<p>Este estudio evalúa la efectividad histórica de diversas medidas utilizadas en la Protección Ejecutiva a través del análisis de 141 intentos de asesinato verificados contra figuras políticas y públicas de alto nivel, ocurridos entre 1900 y 2025 en más de 60 países. Se calcula el Índice de Efectividad Circunstancial (IEC) para armas de fuego, técnicas de manos vacías, vehículos blindados, conducción defensiva y otras medidas reactivas de protección cercana. Los resultados confirman que las herramientas y tácticas de reacción (armas, grandes escoltas, combate cercano) tienen una efectividad combinada de solo 17.73%, fallando en más del 80% de los ataques estudiados. En contraste, las medidas anticipatorias —como la vigilancia, contra-vigilancia y alerta temprana— aunque históricamente subutilizadas, demuestran un potencial significativo para frustrar ataques antes de su ejecución. La verificación rigurosa a través de múltiples fuentes históricas asegura la confiabilidad. Los hallazgos proponen un cambio de paradigma: de un modelo centrado en armas y reacción a un modelo habilitado por inteligencia, preventivo y logístico.</p>
<p><strong>Palabras clave:</strong> protección ejecutiva, efectividad, intentos de asesinato, análisis histórico, estrategias preventivas, inteligencia, contra-vigilancia.</p>

<h2>Introducción</h2>
<p>En la práctica contemporánea, tanto protectores como protegidos a menudo asumen que las armas de fuego constituyen el elemento central de la protección ejecutiva. Esta percepción persiste a pesar de la ausencia de evidencia empírica robusta que la respalde. Parte de esta visión proviene de narrativas culturales, especialmente el cine, la ficción y anécdotas aisladas. Evaluar científicamente la efectividad de estas herramientas es complejo debido a la falta de datos sistemáticos. Por ejemplo, en México solo, el INEGI reporta 2,877 ejecutivos y funcionarios asesinados en décadas recientes, pero no hay información completa sobre cuántos tenían seguridad armada, ni en cuántos casos sus escoltas pudieron influir en el resultado. A escala global, un censo exhaustivo es inviable. Por lo tanto, este estudio adopta una muestra representativa: 141 intentos de asesinato históricamente verificables con presencia confirmada de seguridad armada profesional. Múltiples fuentes —bases de datos enciclopédicas, archivos académicos y reportes periodísticos— se utilizaron para asegurar la precisión histórica y consistencia.</p>

<h2>Metodología</h2>

<h3>2.1 Selección de Casos</h3>
<p>Los 141 casos se seleccionaron siguiendo criterios estrictos:</p>
<ul>
    <li><strong>Universalidad:</strong> más de 60 países.</li>
    <li><strong>Verificabilidad:</strong> casos documentados y ampliamente registrados en fuentes históricas.</li>
    <li><strong>Significancia temporal:</strong> más de 125 años de observación.</li>
    <li><strong>Calidad de protección:</strong> víctimas con seguridad oficial, armada y profesional.</li>
    <li><strong>Relevancia de posición:</strong> jefes de estado, primeros ministros, príncipes, altos funcionarios, candidatos presidenciales, etc.</li>
    <li><strong>Exclusión:</strong> secuestros y asaltos no documentados debido a la falta de datos operativos comparables.</li>
</ul>
<p>Estos criterios aseguran que el estudio observe solo situaciones con un alto estándar de protección, reduciendo la posibilidad de atribuir fallos a improvisación o incompetencia estructural.</p>

<h3>2.2 Categorías de Análisis</h3>
<p>Los intentos de asesinato se clasificaron como:</p>
<ul>
    <li>Intentos no fatales (74 casos)</li>
    <li>Asesinatos consumados (67 casos)</li>
</ul>
<p>La evaluación de efectividad considera una medida como decisiva solo cuando su aplicación asegura directamente la supervivencia del protegido, sin depender de suerte o errores del atacante.</p>

<h3>2.3 Índice de Efectividad Circunstancial (IEC)</h3>
<p>El IEC se define como:</p>
<blockquote>IEC = (Número de casos donde la medida fue decisiva / Número de casos aplicables) × 100</blockquote>
<p><strong>Casos aplicables:</strong> situaciones donde la herramienta podría intervenir razonablemente basado en distancia, tipo de ataque y contexto operativo.</p>
<p><strong>Distancias estimadas:</strong></p>
<ul>
    <li>Corta (&lt;7 m): 93 casos (65.96%).</li>
    <li>Larga (&gt;7 m): 48 casos.</li>
</ul>
<p>La distancia se determinó a través de reconstrucciones históricas, descripciones oficiales y reportes de la escena.</p>

<h3>2.4 Verificación de Datos</h3>
<p>Cada caso fue corroborado a través de múltiples fuentes. Ejemplos:</p>
<ul>
    <li><strong>Principios del siglo XX:</strong> ataques a Eduardo de Gales (1900), Leopoldo II (1902).</li>
    <li><strong>Reacción manual exitosa:</strong> Lenin (1918), Mussolini (1926), Reagan (1981), Rabin (1995).</li>
    <li><strong>Armas decisivas:</strong> Truman (1950), De Gaulle (1961–62), Pinochet (1986), Mubarak (1995), Karzai (2002).</li>
    <li><strong>Fallos con grandes equipos:</strong> Galán (1989, 18 escoltas), Cabrera Barrientos (2024, 15 escoltas), Carlos Manzo (2025, ~20 escoltas).</li>
</ul>
<p>No se encontraron contradicciones significativas entre las fuentes consultadas.</p>

<h2>Resultados</h2>

<h3>3.1 Visión General</h3>
<ul>
    <li>Intentos no fatales: 74 (52.48%)</li>
    <li>Asesinatos consumados: 67 (47.52%)</li>
</ul>

<h3>3.2 Efectividad por Medida</h3>

<h4>Armas de Fuego</h4>
<ul>
    <li><strong>IEC Global:</strong> 3.55% (5/141)</li>
    <li><strong>A distancia corta (&lt;7 m):</strong> 0% (0/93)</li>
    <li><strong>A distancia larga (&gt;7 m):</strong> 10.42% (5/48)</li>
</ul>
<p>En la mayoría de los casos, el ataque ocurre demasiado rápido para una respuesta armada efectiva. Sin embargo, los pocos casos exitosos muestran que las armas no deben descartarse, pero colocarse en su contexto real: una herramienta de bajo rendimiento con aplicaciones excepcionales.</p>

<h4>Técnicas de Manos Vacías</h4>
<ul>
    <li><strong>IEC:</strong> 32.61% (15/46 casos aplicables)</li>
</ul>
<p>Funcionan principalmente contra atacantes solitarios en multitudes y a distancias extremadamente cortas. No son un sustituto de la detección temprana, pero un recurso útil en escenarios de contacto inmediato.</p>

<h4>Vehículos Blindados y Conducción Defensiva</h4>
<ul>
    <li><strong>IEC:</strong> 100% (5/5)</li>
</ul>
<p>Los vehículos blindados destacan como una de las pocas medidas con rendimiento absoluto cuando las condiciones permiten su aplicación. Casos emblemáticos: De Gaulle 1961–62, Aznar 1995, Shevardnadze 1998.</p>

<h4>Efectividad Cumulativa de Medidas de Protección Cercana</h4>
<ul>
    <li><strong>17.73% efectividad combinada</strong></li>
</ul>
<p>(Incluye armas, manos vacías, vehículos blindados y dispositivos de reacción inmediata.) Esto implica que más del 80% de los ataques superaron los esquemas tradicionales de protección cercana, incluso en equipos robustos y altamente entrenados. Ejemplos críticos:</p>
<ul>
    <li>Luis Carlos Galán (1989) con 18 escoltas armadas.</li>
    <li>Cabrera Barrientos (2024) con 15 escoltas federales.</li>
    <li>Carlos Manzo (2025) con ~20 escoltas de Guardia Nacional y policía federal.</li>
</ul>
<p>El tamaño de la operación no compensa las deficiencias preventivas.</p>

<h4>Medidas Anticipatorias (Históricamente Subutilizadas)</h4>
<p>Alerta Temprana Decisiva en uno de los pocos casos documentados de aplicación estructurada:</p>
<ul>
    <li>Donald Trump, septiembre 2024.</li>
</ul>

<h4>La Omisión Crítica: Protección Anticipatoria</h4>
<p>El estudio revela que, a lo largo de 125 años, la Protección Ejecutiva ha sido dominada por:</p>
<ul>
    <li>armas,</li>
    <li>reacción,</li>
    <li>presencia física,</li>
    <li>grandes escoltas.</li>
</ul>
<p>Sin embargo, el análisis histórico muestra que: La mayoría de los atacantes realizaron vigilancia previa, a veces:</p>
<ul>
    <li>días,</li>
    <li>semanas,</li>
    <li>meses antes.</li>
</ul>
<p>Esto fue evidente en:</p>
<ul>
    <li>Ambos ataques a Donald Trump (2024)</li>
    <li>Docenas de emboscadas planificadas desde 1900 hasta hoy.</li>
</ul>
<p>En ningún caso revisado se documenta la implementación sistemática de contra-vigilancia profesional, a pesar de ser uno de los métodos más efectivos en la teoría de seguridad moderna. La ausencia histórica de detección anticipatoria constituye la principal causa estructural de fracaso en el sistema tradicional de protección ejecutiva.</p>

<h2>Discusión</h2>
<p>Los resultados se alinean con hallazgos operativos contemporáneos, como:</p>
<ul>
    <li>El Drill de Tueller, que demuestra que un atacante a distancia corta supera sistemáticamente la velocidad de reacción armada.</li>
    <li>Casos como Sadat (1981) y Galán (1989) prueban que incluso un gran despliegue se vuelve irrelevante sin anticipación.</li>
    <li>El éxito de la alerta temprana en septiembre 2024 muestra la diferencia entre un modelo reactivo y uno anticipatorio.</li>
</ul>

<h3>Limitaciones</h3>
<ul>
    <li>El estudio excluye eventos no documentados.</li>
    <li>El IEC describe efectividad contextual, no absoluta.</li>
    <li>Investigaciones futuras pueden expandir la base de datos y emplear simulaciones operativas.</li>
</ul>

<h2>Conclusión</h2>
<p>Los datos son inequívocos:</p>
<ul>
    <li>Las armas de fuego no son la medida central de la protección ejecutiva. Con 3.55% de efectividad histórica, su utilidad es marginal y debe entenderse como un recurso complementario, no estructural.</li>
    <li>La prevención anticipatoria es la clave del futuro. El análisis sugiere que hasta el 80% de los intentos de asesinato podrían haber sido frustrados con una combinación sistemática de:
        <ul>
            <li>Contra-vigilancia / detección de vigilancia</li>
            <li>Alerta temprana</li>
            <li>Logística protectora</li>
        </ul>
    </li>
    <li>Las medidas reactivas son insuficientes. La efectividad combinada de 17.73% demuestra que la reacción llega tarde en la mayoría de los contextos.</li>
    <li>La Protección Ejecutiva del Siglo XXI debe ser:
        <ul>
            <li>Habilitada por inteligencia,</li>
            <li>Predictiva,</li>
            <li>Logística,</li>
            <li>Basada en anticipación, no en armamento.</li>
        </ul>
    </li>
</ul>

<h2>Lista Consolidada de Casos (1–141)</h2>
<p>La siguiente lista incluye todos los 141 casos en el orden presentado en el conjunto de datos original, renumerados secuencialmente para claridad. Intentos (1–74) son no fatales; consumados (75–141) son fatales. Anotaciones indican factores decisivos donde aplican.</p>
<ol>
    <li>1 Edward, Prince of Wales – 1900</li>
    <li>2 Leopold II, King of Belgium – 1902</li>
    <li>3 Alfonso XIII, King of Spain – 1906</li>
    <li>4 Theodore Roosevelt, U.S. presidential candidate – 1912</li>
    <li>5 Lenin – 1918 (attacker subdued using empty hands)</li>
    <li>6 Georges Clemenceau, Prime Minister of France – 1919</li>
    <li>7 Benito Mussolini, Leader of Fascist Italy – April 1926 (attacker subdued using empty hands)</li>
    <li>8 Benito Mussolini, Leader of Fascist Italy – May 1926 (attacker subdued using empty hands)</li>
    <li>9 Herbert Hoover, President of the U.S. – 1928</li>
    <li>10 Franklin D. Roosevelt, President of the U.S. – 1933 (attacker subdued using empty hands)</li>
    <li>11 Keisuke Okada, Prime Minister of Japan – 1936</li>
    <li>12 Mohammad Reza Pahlavi, Shah of Iran – 1949</li>
    <li>13 Harry Truman, President of the United States – 1950 (firearms were decisive)</li>
    <li>14 Prince Hussein, Prince of Jordan – 1960</li>
    <li>15 Konrad Adenauer, German Chancellor – 1952</li>
    <li>16 Hendrik Verwoerd, Prime Minister of South Africa – 1960 (attacker subdued with empty hands)</li>
    <li>17 Charles De Gaulle, President of France – 1961 (vehicle handling was decisive)</li>
    <li>18 Charles De Gaulle, President of France – 1962 (vehicle handling was decisive)</li>
    <li>19 Georgios Papadopoulos, President of Greece – 1968</li>
    <li>20 Leonid Brezhnev, General Secretary of the Soviet Union – 1969</li>
    <li>21 George Wallace, U.S. Presidential Candidate – 1972</li>
    <li>22 Anne, Princess of England – 1974</li>
    <li>23 Sukarno, President of Indonesia – 1962</li>
    <li>24 Gerald Ford, President of the United States – 1975 (attacker subdued with empty hands)</li>
    <li>25 Elizabeth II, Queen of England – 1981</li>
    <li>26 Pope John Paul II – 1981 (attacker subdued with empty hands)</li>
    <li>27 Ronald Reagan, President of the United States – 1981 (attacker subdued using empty hands)</li>
    <li>28 Chun Doo Hwan, President of South Korea – 1983</li>
    <li>29 Margaret Thatcher, British Prime Minister – 1984</li>
    <li>30 Augusto Pinochet, President of Chile – 1986 (firearms were decisive)</li>
    <li>31 Wolfgang Schäuble, German Interior Minister – 1990 (attacker subdued using empty hands)</li>
    <li>32 John Major, Prime Minister of the United Kingdom – 1991 (armored windows were decisive)</li>
    <li>33 Eduard Shevardnadze, President of Georgia – 1992</li>
    <li>34 Eduard Shevardnadze, President of Georgia – 1995</li>
    <li>35 Hosni Mubarak, President of Egypt – 1995 (firearms were decisive)</li>
    <li>36 Kiro Gligorov, President of Macedonia – 1995</li>
    <li>37 José María Aznar, Spanish politician and former Prime Minister – 1995 (armored vehicle and attacker failures were decisive)</li>
    <li>38 Charles, Prince of Wales – 1995</li>
    <li>39 Eduard Shevardnadze, President of Georgia – 1998 (armored vehicle was decisive)</li>
    <li>40 Jacques Chirac, President of France – 2002 (attacker subdued with empty hands)</li>
    <li>41 Hamid Karzai, President of Afghanistan – 2002 (firearms were decisive)</li>
    <li>42 Pervez Musharraf, President of Pakistan – 2003</li>
    <li>43 Murat Zyazikov, President of Ingushetia – 2004</li>
    <li>44 Shaukat Aziz, Prime Minister of Pakistan – 2004</li>
    <li>45 Sheikh Hasina, Prime Minister of Bangladesh – 2004</li>
    <li>46 Ibrahim Rugova, President of Kosovo – 2005</li>
    <li>47 Pervez Musharraf, President of Pakistan – 2007</li>
    <li>48 George W. Bush, President of the United States and Mikheil Saakashvili, President of Georgia – 2005</li>
    <li>49 Abdullahi Yusuf Ahmed, President of Somalia – 2006</li>
    <li>50 Gotabaya Rajapaksa, Secretary of Defense of Sri Lanka – 2006</li>
    <li>51 Dick Cheney, Vice President of the United States – 2007</li>
    <li>52 Guillaume Soro, Prime Minister of Côte d’Ivoire – 2007</li>
    <li>53 Abdul Gayoom, President of Maldives – 2008 (attacker subdued using empty hands)</li>
    <li>54 José Ramos Horta, President of East Timor – 2008</li>
    <li>55 Queen Beatrix, Queen of the Netherlands – 2009</li>
    <li>56 Yunus-Bek Yevkurov, Leader of Ingushetia – 2009</li>
    <li>57 Stephen Timms, British Labour MP – 2010</li>
    <li>58 Ali Abdullah Saleh, President of Yemen – 2011</li>
    <li>59 Alpha Condé, President of Guinea – 2011 (firearms were decisive)</li>
    <li>60 Abdul Ghafoor Haideri, Pakistani Senate Leader – 2017</li>
    <li>61 Nicolás Maduro, President of Venezuela – 2018</li>
    <li>62 Omar García Harfuch, Mexico City Police Chief – 2020</li>
    <li>63 Iván Duque, President of Colombia – 2021</li>
    <li>64 Assimi Goïta, President of Mali – 2021 (attacker subdued with empty hands)</li>
    <li>65 Aleksandar Vučić, President of Serbia – 2022</li>
    <li>66 Cristina Fernández de Kirchner, Vice President of Argentina – 2022</li>
    <li>67 Emmanuel Macron, President of France – 2023 (attacker subdued with empty hands)</li>
    <li>68 Fumio Kishida, Prime Minister of Japan – 2023 (attacker subdued with empty hands)</li>
    <li>69 Lee Jae-myung, Opposition Leader in South Korea – 2024</li>
    <li>70 Robert Fico, Prime Minister of Slovakia – 2024</li>
    <li>71 Donald Trump, Former U.S. President – July 2024</li>
    <li>72 Donald Trump, Former U.S. President – September 2024 (early warning was decisive)</li>
    <li>73 Daniel Uribe – 2025 (firearms were not effective)</li>
    <li>74 Serhiy Sternenko, Ukrainian Activist – 2025 (empty hands were decisive)</li>
    <li>75 William McKinley, President of the United States – 1901</li>
    <li>76 Franz Ferdinand, Archduke of Austria – 1914</li>
    <li>77 Sidónio Pais, President of Portugal – 1918</li>
    <li>78 Michael Collins, Irish Revolutionary Leader – 1922</li>
    <li>79 Ahmet Muhtar Zogolli – 1924</li>
    <li>80 Alexander I, King of Yugoslavia – 1939</li>
    <li>81 Walter Edward Guinness, Lord Moyne, UK Minister in the Middle East – 1944</li>
    <li>82 Ahmad Mahar Pasha, Prime Minister of Egypt – 1945</li>
    <li>83 Mahmud Fahmi Nokrashi, Prime Minister of Egypt – 1948</li>
    <li>84 Abdullah I, King of Jordan – 1951</li>
    <li>85 José Antonio Remón Cantera, President of Panama – 1955</li>
    <li>86 Hendrik Verwoerd, Prime Minister of South Africa – 1960</li>
    <li>87 Hazza al-Majali, Prime Minister of Jordan – 1960</li>
    <li>88 Louis Rwagasore, Prime Minister of Burundi – 1961</li>
    <li>89 John F. Kennedy, President of the United States – 1963</li>
    <li>90 Joseph Bamina, Prime Minister of Burundi – 1965</li>
    <li>91 Hendrik Frensch Verwoerd, President of South Africa – 1966</li>
    <li>92 Robert F. Kennedy, U.S. Attorney General – 1968</li>
    <li>93 Martin Luther King, African-American Activist – 1968</li>
    <li>94 Abdirashid Ali Sharmarke, President of Somalia – 1969</li>
    <li>95 Wasfi al-Tal, Prime Minister of Jordan – 1971</li>
    <li>96 Abdul Rahman, Inspector General of Police of Malaysia – 1974</li>
    <li>97 François Tombalbaye, President of Chad – 1975</li>
    <li>98 Sheikh Mujibur Rahman, President of Bangladesh – 1975</li>
    <li>99 Murtala Muhammed, Head of State of Nigeria – 1976</li>
    <li>100 Hans Martin Schleyer, German Business Leader – 1977</li>
    <li>101 Marien Ngouabi, President of Congo – 1977</li>
    <li>102 Ahmad bin Hussein al-Ghashmi, President of the Republic of Yemen – 1978</li>
    <li>103 Aldo Moro, Former Prime Minister of Italy – 1978</li>
    <li>104 Park Chung Hee, President of South Korea – 1979</li>
    <li>105 Lord Louis Mountbatten, British Diplomat and Royal Navy Officer – 1979</li>
    <li>106 William Richard Tolbert, President of Liberia – 1980</li>
    <li>107 Anwar el-Sadat, Prime Minister of Egypt – 1981</li>
    <li>108 Ziaur Rahman, President of Bangladesh – 1981</li>
    <li>109 Bachir Gemayel, President-Elect of Lebanon – 1982</li>
    <li>110 Mohammad Ali Rajai, President of Iran – 1981</li>
    <li>111 Indira Gandhi, Prime Minister of India – 1984</li>
    <li>112 Rodrigo Lara Bonilla, Minister of Justice of Colombia – 1984</li>
    <li>113 Thomas Sankara, President of Burkina Faso – 1987</li>
    <li>114 Carlos Mauro Hoyos, Attorney General of Colombia – 1988</li>
    <li>115 Luis Carlos Galán, Colombian Presidential Candidate – 1989</li>
    <li>116 James N. Rowe, U.S. Military Advisor – 1989</li>
    <li>117 Waldemar Franklin Quintero, Commander of the Antioquia Police, Colombia – 1989</li>
    <li>118 Alfred Herrhausen, CEO of Deutsche Bank – 1989</li>
    <li>119 Samuel Doe, President of Liberia – 1990</li>
    <li>120 Bernardo Jaramillo Ossa, Presidential Candidate, Leader of the Patriotic Union Party – 1990</li>
    <li>121 Rajiv Gandhi, Indian Politician – 1991</li>
    <li>122 Giovanni Falcone, Anti-Mafia Judge – 1992</li>
    <li>123 Melchior Ndadaye, President of Burundi – 1993</li>
    <li>124 Luis Donaldo Colosio, Mexican Presidential Candidate – 1994</li>
    <li>125 Juvénal Habyarimana, President of Rwanda – 1994</li>
    <li>126 Yitzhak Rabin, Prime Minister of Israel – 1995</li>
    <li>127 Vazgen Sargsyan, Prime Minister of Armenia – 1999</li>
    <li>128 Luis María Argaña, Vice President of Paraguay – 1999</li>
    <li>129 Zoran Đinđić, Prime Minister of Serbia – 2003</li>
    <li>130 João Bernardo Vieira, President of Guinea – 2009</li>
    <li>131 Benazir Bhutto, Former Prime Minister of Pakistan – 2007</li>
    <li>132 Ali Abdullah Saleh, President of Yemen – 2017</li>
    <li>133 Alexander Zakharchenko, President of the Donetsk Republic – 2018</li>
    <li>134 Aristóteles Sandoval, Former Governor of the State of Jalisco – 2020</li>
    <li>135 Jovenel Moïse, President of Haiti – 2021</li>
    <li>136 Shinzo Abe, Former Prime Minister of Japan – 2022</li>
    <li>137 Atiq Ahmed, Former Prime Minister of India – 2023</li>
    <li>138 Fernando Villavicencio, Ecuadorian Presidential Candidate – 2023</li>
    <li>139 José Alfredo Cabrera Barrientos, Candidate for Mayor of Coyuca de Benítez, Guerrero, Mexico – 2024</li>
    <li>140 Charlie Kirk, American Activist – 2025</li>
    <li>141 Carlos Manzo, Alcalde de Uruapan, México – 2025</li>
</ol>

<h2>Referencias</h2>
<ul>
    <li>[0] Exploring factors in successful vs. unsuccessful terrorist assassinations. START. <a href="https://www.start.umd.edu/news/exploring-factors-successful-vs-unsuccessful-terrorist-assassinations">Link</a></li>
    <li>[1] Assassination of political leaders: The role of social conflict. ScienceDirect. <a href="https://www.sciencedirect.com/science/article/abs/pii/S1048984316301047">Link</a></li>
    <li>[2] “A Study of Assassination”-Transcription. National Security Archive. <a href="https://nsarchive2.gwu.edu/NSAEBB/NSAEBB4/ciaguat2.html">Link</a></li>
    <li>[3] Distance and Threats – An Unpublished Section from “Left of Bang”. CP Journal. <a href="https://www.cp-journal.com/p/distance-and-threats-an-unpublished">Link</a></li>
    <li>[4] Hit or Miss? The Effect of Assassinations on Institutions and War. Kellogg School of Management. <a href="https://www.kellogg.northwestern.edu/faculty/jones-ben/htm/Assassinations%20Paper.pdf">Link</a></li>
    <li>[5] Analysis - Faces of Assassination. Global Initiative. <a href="https://assassination.globalinitiative.net/analysis/geographic/">Link</a></li>
    <li>[6] Are assassination attempts getting more common? Vox. <a href="https://www.vox.com/world-politics/360639/trump-shot-thomas-matthew-crooks-assassination-attempt">Link</a></li>
    <li>[7] Instituto Nacional de Estadística y Geografía (INEGI) data on assassinations in Mexico. (Internal reference from study methodology).</li>
    <li>[8] Political leader assassination attempts are on the rise worldwide. The Hub. <a href="https://thehub.ca/2024/07/19/worldwide-leader-assassination-attempts-are-on-the-rise-after-years-of-decline/">Link</a></li>
    <li>[9] Gunman was a few hundred feet away from Trump, CNN analysis. CNN. <a href="https://www.cnn.com/2024/07/14/politics/trump-rally-shooting-distance">Link</a></li>
    <li>[10] Assassination of Miguel Uribe Turbay. Wikipedia. <a href="https://en.wikipedia.org/wiki/Assassination_of_Miguel_Uribe_Turbay">Link</a></li>
    <li>[20] Assassination of Charlie Kirk. Wikipedia. <a href="https://en.wikipedia.org/wiki/Assassination_of_Charlie_Kirk">Link</a></li>
    <li>[30] Notable Ukrainian activist injured in apparent assassination attempt. Euronews. <a href="https://www.euronews.com/my-europe/2025/05/01/ukrainian-activist-injured-in-an-attempted-assassination-suspect-detained">Link</a></li>
    <li>[39] List of United States presidential assassination attempts and plots. Wikipedia. <a href="https://en.wikipedia.org/wiki/List_of_United_States_presidential_assassination_attempts_and_plots">Link</a></li>
    <li>[40] Charlie Kirk shooting: A timeline of recent political violence in America. ABC News. <a href="https://abcnews.go.com/Politics/charlie-kirk-shooting-timeline-recent-political-violence-america/story?id=125473910">Link</a></li>
    <li>[41] How recent political violence in the U.S. fits into ‘a long, dark history’. PBS. <a href="https://www.pbs.org/newshour/politics/how-recent-political-violence-in-the-u-s-fits-into-a-long-dark-history">Link</a></li>
    <li>[49] List of people who survived assassination attempts. Wikipedia. <a href="https://en.wikipedia.org/wiki/List_of_people_who_survived_assassination_attempts">Link</a></li>
    <li>[50] List of assassinated persons. Wikipedia. <a href="https://en.wikipedia.org/wiki/List_of_assassinated_persons">Link</a></li>
</ul>
`;

const EXCERPT = "Este estudio evalúa la efectividad histórica de diversas medidas utilizadas en la Protección Ejecutiva a través del análisis de 141 intentos de asesinato verificados contra figuras políticas y públicas de alto nivel.";

async function main() {
    // 1. Find an author
    const author = await prisma.user.findFirst();
    if (!author) {
        throw new Error("No users found in database to assign as author.");
    }
    console.log(`Using author: ${author.name} (${author.email})`);

    // 2. Check if post exists
    const existing = await prisma.blogPost.findUnique({
        where: { slug: SLUG }
    });

    if (existing) {
        console.log("Post already exists. Updating...");
        await prisma.blogPost.update({
            where: { slug: SLUG },
            data: {
                title: TITLE,
                content: CONTENT,
                excerpt: EXCERPT,
                image: IMAGE_PATH,
                pinned: true,
                published: true,
                language: 'es'
            }
        });
        console.log("Post updated.");
    } else {
        console.log("Creating new post...");
        await prisma.blogPost.create({
            data: {
                title: TITLE,
                slug: SLUG,
                content: CONTENT,
                excerpt: EXCERPT,
                image: IMAGE_PATH,
                pinned: true,
                published: true,
                language: 'es',
                authorId: author.id
            }
        });
        console.log("Post created.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
