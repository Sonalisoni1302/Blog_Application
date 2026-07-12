// fixBrokenTags.js
// One-time migration: repairs blog documents whose `tags` array ended up as
// a single element containing a JSON-stringified array, e.g.
//   tags: ['["Jwt","Authentication"]']
// instead of
//   tags: ["jwt", "authentication"]
//
// Run once with: node fixBrokenTags.js

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require("dotenv").config(); // loads your .env, same as server.js
const mongoose = require("mongoose");
const BlogModel = require("./Models/BlogModel"); // matches Blog_Server/Models/BlogModel.js

const DB_URI = process.env.DB; // matches your server.js: mongoose.connect(process.env.DB)

async function run() {
    await mongoose.connect(DB_URI);

    const blogs = await BlogModel.find({});
    let fixedCount = 0;

    for (const blog of blogs) {
        if (
            Array.isArray(blog.tags) &&
            blog.tags.length === 1 &&
            typeof blog.tags[0] === "string" &&
            blog.tags[0].trim().startsWith("[")
        ) {
            try {
                const parsed = JSON.parse(blog.tags[0]);
                if (Array.isArray(parsed)) {
                    blog.tags = parsed.map((t) => String(t).toLowerCase());
                    await blog.save();
                    fixedCount++;
                    console.log(`Fixed tags for blog_Id: ${blog.blog_Id}`, blog.tags);
                }
            } catch (e) {
                console.log(`Could not parse tags for blog_Id: ${blog.blog_Id}`, blog.tags[0]);
            }
        }
    }

    console.log(`Done. Fixed ${fixedCount} blog(s).`);
    await mongoose.disconnect();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});