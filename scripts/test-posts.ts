
import { getSortedPostsData } from '../src/lib/data/content/posts';

try {
    console.log("Fetching posts...");
    const posts = getSortedPostsData();
    console.log(`Fetched ${posts.length} posts.`);
    posts.forEach(p => {
        console.log(`- ${p.title} (${p.date})`);
        if (!p.date) {
            console.warn(`  WARNING: Post ${p.slug} has no date!`);
        }
        try {
            const d = new Date(p.date || "");
            if (isNaN(d.getTime())) {
                console.error(`  ERROR: Post ${p.slug} has invalid date: ${p.date}`);
            }
        } catch (e) {
            console.error(`  ERROR: Post ${p.slug} date parsing failed:`, e);
        }
    });
    console.log("Done.");
} catch (e) {
    console.error("CRASH:", e);
}
