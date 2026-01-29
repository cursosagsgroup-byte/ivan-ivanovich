import fs from 'fs';
import path from 'path';

const blogPostsPath = path.join(process.cwd(), 'app/data/blog-posts.json');

const newPost = {
    id: "17401",
    title: "Historical Analysis of the Effectiveness of Executive Protection Measures: A Study of 141 Assassination Attempts Against Public  Figures (1900–2025)",
    slug: "analisis-historico-efectividad-proteccion-ejecutiva-estudio-141-atentados",
    date: "2025-01-17",
    excerpt: "A comprehensive study analyzing 141 assassination attempts against prominent public figures over 125 years reveals the true effectiveness of executive protection measures.",
    content: `<p>Este análisis examina 141 intentos de asesinato contra figuras públicas prominentes durante 125 años en 60 países diferentes, revelando datos críticos sobre la efectividad real de las medidas de protección ejecutiva.</p>

<h2>Metodología del Estudio</h2>
<p>Para establecer un estudio riguroso, se aplicaron los siguientes criterios de selección:</p>

<ol>
<li>Carácter universal: casos documentados en todo el mundo</li>
<li>Hechos históricamente comprobables y ampliamente difundidos</li>
<li>Número suficientemente representativo de casos</li>
<li>Periodo de tiempo significativo (125 años)</li>
<li>Confirmación de que las víctimas contaban con equipo de seguridad armada</li>
<li>Víctimas de máximo o muy alto rango, o con protección oficial asignada</li>
</ol>

<h2>Resultados Principales</h2>
<p>El análisis revela que las medidas tradicionales de protección ejecutiva tienen una efectividad sorprendentemente baja:</p>

<ul>
<li>Armas de fuego: 3.57% de efectividad</li>
<li>Manos vacías: 10.79% de efectividad</li>
<li>Vehículos blindados y manejo defensivo: 100% cuando se utilizan</li>
<li>Alerta temprana: Altamente efectiva en los casos aplicados</li>
</ul>

<h2>Conclusiones</h2>
<p>Los datos demuestran que la protección ejecutiva moderna debe enfocarse en medidas anticipadas como contravigilancia, inteligencia y alerta temprana, en lugar de depender únicamente de la reacción armada.</p>

<h2>Referencias</h2>
<ol start="0">
<li>Exploring factors in successful vs. unsuccessful terrorist assassinations. <em>START</em>. <a href="https://www.start.umd.edu/news/exploring-factors-successful-vs-unsuccessful-terrorist-assassinations">https://www.start.umd.edu/news/exploring-factors-successful-vs-unsuccessful-terrorist-assassinations</a></li>
<li>Assassination of political leaders: The role of social conflict. <em>ScienceDirect</em>. <a href="https://www.sciencedirect.com/science/article/abs/pii/S1048984316301047">https://www.sciencedirect.com/science/article/abs/pii/S1048984316301047</a></li>
<li>"A Study of Assassination"-Transcription. <em>National Security Archive</em>. <a href="https://nsarchive2.gwu.edu/NSAEBB/NSAEBB4/ciaguat2.html">https://nsarchive2.gwu.edu/NSAEBB/NSAEBB4/ciaguat2.html</a></li>
<li>Distance and Threats – An Unpublished Section from "Left of Bang". <em>CP Journal</em>. <a href="https://www.cp-journal.com/p/distance-and-threats-an-unpublished">https://www.cp-journal.com/p/distance-and-threats-an-unpublished</a></li>
<li>Hit or Miss? The Effect of Assassinations on Institutions and War. <em>Kellogg School of Management</em>. <a href="https://www.kellogg.northwestern.edu/faculty/jones-ben/htm/Assassinations%20Paper.pdf">https://www.kellogg.northwestern.edu/faculty/jones-ben/htm/Assassinations%20Paper.pdf</a></li>
<li>Analysis - Faces of Assassination. <em>Global Initiative</em>. <a href="https://assassination.globalinitiative.net/analysis/geographic/">https://assassination.globalinitiative.net/analysis/geographic/</a></li>
<li>Are assassination attempts getting more common? <em>Vox</em>. <a href="https://www.vox.com/world-politics/360639/trump-shot-thomas-matthew-crooks-assassination-attempt">https://www.vox.com/world-politics/360639/trump-shot-thomas-matthew-crooks-assassination-attempt</a></li>
<li>Instituto Nacional de Estadística y Geografía (INEGI) data on assassinations in Mexico. (Internal reference from study methodology).</li>
<li>Political leader assassination attempts are on the rise worldwide. <em>The Hub</em>. <a href="https://thehub.ca/2024/07/19/worldwide-leader-assassination-attempts-are-on-the-rise-after-years-of-decline/">https://thehub.ca/2024/07/19/worldwide-leader-assassination-attempts-are-on-the-rise-after-years-of-decline/</a></li>
<li>Gunman was a few hundred feet away from Trump, CNN analysis. <em>CNN</em>. <a href="https://www.cnn.com/2024/07/14/politics/trump-rally-shooting-distance">https://www.cnn.com/2024/07/14/politics/trump-rally-shooting-distance</a></li>
<li>Assassination of Miguel Uribe Turbay. <em>Wikipedia</em>. <a href="https://en.wikipedia.org/wiki/Assassination_of_Miguel_Uribe_Turbay">https://en.wikipedia.org/wiki/Assassination_of_Miguel_Uribe_Turbay</a></li>
<li>Assassination of Charlie Kirk. <em>Wikipedia</em>. <a href="https://en.wikipedia.org/wiki/Assassination_of_Charlie_Kirk">https://en.wikipedia.org/wiki/Assassination_of_Charlie_Kirk</a></li>
<li>Notable Ukrainian activist injured in apparent assassination attempt. <em>Euronews</em>. <a href="https://www.euronews.com/my-europe/2025/05/01/ukrainian-activist-injured-in-an-attempted-assassination-suspect-detained">https://www.euronews.com/my-europe/2025/05/01/ukrainian-activist-injured-in-an-attempted-assassination-suspect-detained</a></li>
<li>List of United States presidential assassination attempts and plots. <em>Wikipedia</em>. <a href="https://en.wikipedia.org/wiki/List_of_United_States_presidential_assassination_attempts_and_plots">https://en.wikipedia.org/wiki/List_of_United_States_presidential_assassination_attempts_and_plots</a></li>
<li>Charlie Kirk shooting: A timeline of recent political violence in America. <em>ABC News</em>. <a href="https://abcnews.go.com/Politics/charlie-kirk-shooting-timeline-recent-political-violence-america/story?id=125473910">https://abcnews.go.com/Politics/charlie-kirk-shooting-timeline-recent-political-violence-america/story?id=125473910</a></li>
<li>How recent political violence in the U.S. fits into 'a long, dark history'. <em>PBS</em>. <a href="https://www.pbs.org/newshour/politics/how-recent-political-violence-in-the-u-s-fits-into-a-long-dark-history">https://www.pbs.org/newshour/politics/how-recent-political-violence-in-the-u-s-fits-into-a-long-dark-history</a></li>
<li>List of people who survived assassination attempts. <em>Wikipedia</em>. <a href="https://en.wikipedia.org/wiki/List_of_people_who_survived_assassination_attempts">https://en.wikipedia.org/wiki/List_of_people_who_survived_assassination_attempts</a></li>
<li>List of assassinated persons. <em>Wikipedia</em>. <a href="https://en.wikipedia.org/wiki/List_of_assassinated_and_executed_heads_of_state_and_government">https://en.wikipedia.org/wiki/List_of_assassinated_and_executed_heads_of_state_and_government</a></li>
</ol>`,
    image: "/images/blog/analisis-historico-efectividad-proteccion-ejecutiva.jpeg",
    author: "Ivan Ivanovich"
};

async function publishPost() {
    try {
        // Read existing posts
        const data = fs.readFileSync(blogPostsPath, 'utf-8');
        const posts = JSON.parse(data);

        // Check if post already exists
        const existingIndex = posts.findIndex((p: any) => p.slug === newPost.slug);

        if (existingIndex !== -1) {
            // Update existing post
            posts[existingIndex] = newPost;
            console.log('Updated existing post');
        } else {
            // Add new post at the beginning
            posts.unshift(newPost);
            console.log('Added new post');
        }

        // Write back to file
        fs.writeFileSync(blogPostsPath, JSON.stringify(posts, null, 2));
        console.log('Blog post published successfully!');
        console.log(`Post ID: ${newPost.id}`);
        console.log(`Slug: ${newPost.slug}`);
    } catch (error) {
        console.error('Error publishing post:', error);
    }
}

publishPost();
