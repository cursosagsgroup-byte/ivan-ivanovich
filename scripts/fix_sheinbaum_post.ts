
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const englishTitle = "The Harassment of President Sheinbaum: Mexico Needs a Specialized Executive Protection Institution";
const englishExcerpt = "The recent incident of sexual harassment against President Claudia Sheinbaum, which occurred in the heart of Mexico City's Historic Center and in front of her protection team...";

const englishContent = `
<p>The recent incident of sexual harassment against President Claudia Sheinbaum, which occurred in the heart of Mexico City's Historic Center and in front of her protection team, not only evidences a momentary failure in the presidential security device: it reveals a deep institutional deficiency that Mexico has dragged for almost a decade regarding the protection of high-level executives and leaders at risk.</p>
<p>Beyond media curiosity or social indignation, this fact must be analyzed from the technical perspective of risk management for officials in public environments.</p>
<p>What we saw was not a simple error by a protector, but the reflection of a non-existent system, replaced by a symbolic, disjointed model without doctrine, which has not evolved at the pace of contemporary threats nor has it been structured according to the high-risk needs facing the country.</p>
<p>The aggressor did not carry weapons, did not attempt to attack the president's life, and was detained hours later (although he should have been intervened immediately, as it was a case in flagrante delicto requiring real-time threat assessment).</p>
<p>However, the simple fact of having managed to physically approach the president, despite the presence of a protection device, constitutes a critical vulnerability.</p>
<p>An attack with another motivation —a physical aggression, a bladed weapon, or an acid attack— would have had very different consequences.
In technical terms, it is a systemic failure, aggravated by the absence of early warning and threat detection.
The system intervened after physical contact, not before. And in executive protection, detecting afterwards is equivalent to failing.</p>
<h3>1. The "Ayudantía" Model</h3>
<p>For years, the so-called Presidential Ayudantía (Adjutancy) has been presented as a symbolic alternative to the extinct Presidential General Staff (EMP). However, beyond the political gesture, the model lacks doctrine, standardized training, and risk assessment protocols—as became evident.</p>
<p>These teams are usually made up of trusted personnel or close collaborators; their main function is more to accompany than to protect.</p>
<p>In President Sheinbaum's case, that vulnerability was publicly exposed: the protection system failed to anticipate, deter, or contain a low-level threat.</p>
<h3>2. The Absence of a National Executive Protection Institution</h3>
<p>The political decision to dismantle the old Presidential General Staff, an obsolete structure in several aspects, is understandable.</p>
<p>But what should have been done upon eliminating it was to create something better: a modern, professional, and technical institution, in accordance with 21st-century risks.</p>
<p>Today, Mexico lacks a civil, professional, and technical institution dedicated exclusively to the protection of persons in critical positions or with ultra-high risk, as was the case of Mayor Carlos Manzo Rodríguez, recently assassinated in Michoacán in front of his team and National Guard elements.</p>
<p>In many countries with high political or criminal risk, there are national training and certification centers that establish doctrines, standards, and procedures for the protection of officials, diplomats, and corporate leaders.</p>
<p>The Sheinbaum incident must be an urgent call to create a National Executive Protection Agency, dependent on intelligence agencies, capable of integrating doctrine, training, intelligence, and operations under a modern, discreet, and effective legal framework.</p>
<p>An institution that trains qualified personnel in behavioral detection, counter-surveillance, crowd management, protective logistics, and early warning. Modern executive security relies not on muscular bodyguards or symbols of power. It relies on anticipation, discretion, intelligence, and cognitive mastery of the environment.</p>
<p>The harassment of President Sheinbaum was not a planned attack, but it was a painful reminder: Mexico still does not understand executive protection as a strategic State discipline.</p>
<p>As long as there is no national institution dedicated to executive protection, we will continue to depend on individual reflexes and improvisation, instead of science, doctrine, and applied intelligence.
And in a country with current levels of violence and polarization, that is not just an operational error: it is a national vulnerability.</p>
<p>Because protecting those who govern is not a privilege: it is a question of State stability.</p>
`;

async function main() {
    // Slug logic: verify assuming '-en' suffix
    // The original slug is: el-acoso-a-la-presidenta-sheinbaum-mexico-necesita-una-institucion-especializada-de-proteccion-ejecutiva
    const originalSlug = 'el-acoso-a-la-presidenta-sheinbaum-mexico-necesita-una-institucion-especializada-de-proteccion-ejecutiva';
    const englishSlug = originalSlug + '-en';

    console.log(`Updating post with slug: ${englishSlug}`);

    try {
        const updatedPost = await prisma.blogPost.updateMany({
            where: {
                slug: englishSlug,
                language: 'en' // Ensure we are targeting the English version
            },
            data: {
                title: englishTitle,
                excerpt: englishExcerpt,
                content: englishContent
            }
        });

        if (updatedPost.count > 0) {
            console.log(`Successfully updated ${updatedPost.count} post(s).`);
        } else {
            console.log("No posts found to update. Checking if the post exists without content...");
            const post = await prisma.blogPost.findUnique({
                where: { slug: englishSlug }
            });
            if (post) {
                console.log("Post exists but updateMany failed? Retrying with update...");
                await prisma.blogPost.update({
                    where: { slug: englishSlug },
                    data: {
                        title: englishTitle,
                        excerpt: englishExcerpt,
                        content: englishContent
                    }
                });
                console.log("Update successful via unique slug.");
            } else {
                console.log("Post with English slug not found in DB.");
                // Check if we need to create it? (User says "if I enter in English", implying it exists but empty or Spanish)
                // If the redirect logic works, the user is redirected to this slug. If it renders, it must exist.
            }
        }
    } catch (e) {
        console.error("Error updating post:", e);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
