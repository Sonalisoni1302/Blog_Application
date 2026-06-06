const { CreateBlogController, GetAllBlogsController, UpdateBlogController, DeleteBlogController, GetUserBlogsController, GetLetestBlogsController, GetTrendingBlogsController, SearchBlogController, GetallLatestBlogsCount, searchBlogCount, GetBlogController, GetUserBlogsCountController } = require("../Controllers/BlogController");

const express = require("express");
const { AuthMiddleware } = require("../Middleware/AuthMiddleware");
const router = express.Router();
const upload = require("../cloudnry_conf/multer"); 


// CREATE NEW BLOG
// router.post("/create-blog", AuthMiddleware, upload.single("banner"), CreateBlogController);
// router.post("/create-blog", AuthMiddleware, CreateBlogController);

router.post(
  "/create-blog",
  AuthMiddleware,
  (req, res, next) => {
    upload.single("banner")(req, res, function (err) {
      if (err) {
        console.error("MULTER/CLOUDINARY ERROR:");
        console.dir(err, { depth: null });

        return res.status(500).json({
          success: false,
          error: err.message || JSON.stringify(err),
        });
      }

      next();
    });
  },
  CreateBlogController
);


// GET Latest BLOGS
router.post("/latest-blogs", GetLetestBlogsController);


// All LATEST BLOG COUNT
router.post("/all-latest-blogs-count", GetallLatestBlogsCount);


// GET TRENDING BLOGS
router.post("/trending-blogs", GetTrendingBlogsController);


// GET USER BLOGS
router.post("/user-blogs", AuthMiddleware, GetUserBlogsController);
router.post("/user-blogs-count", AuthMiddleware, GetUserBlogsCountController);


// SERCH BLOGS
router.post("/search-blogs", SearchBlogController);
router.post("/search-blogs-count", searchBlogCount);


// UPDATE BLOG
router.put("/update-blog/:id", AuthMiddleware, UpdateBlogController);


// DELETE BLOG
router.post("/delete-blog", AuthMiddleware, DeleteBlogController);

// GET BLOG
router.post("/get-blog", GetBlogController);


module.exports = router;