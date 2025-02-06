document.addEventListener("DOMContentLoaded", function () {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    const postSection = document.getElementById("postSection");
    const viewSection = document.getElementById("viewSection");
    const topPostsSection = document.getElementById("topPostsSection");
    const backToPostButton = document.getElementById("backToPostButton");
    const backToViewPostsButton = document.getElementById("backToViewPostsButton");

    function populateYearAndMonth() {
        const currentYear = new Date().getFullYear();  // 現在の年
        const yearSelect = document.getElementById("postYear");
        const monthSelect = document.getElementById("postMonth");
        const yearSelectView = document.getElementById("yearSelect");
        const monthSelectView = document.getElementById("monthSelect");
    
        // 年の選択肢を追加
        for (let year = 1900; year <= currentYear; year++) {
            let option = document.createElement("option");
            option.value = year;
            option.text = year;
            yearSelect.appendChild(option);
    
            // 年の選択肢をビューにも追加
            yearSelectView.appendChild(option.cloneNode(true));
        }
    
        // 月の選択肢を追加
        for (let month = 1; month <= 12; month++) {
            let option = document.createElement("option");
            option.value = month;
            option.text = month;
            monthSelect.appendChild(option);
            monthSelectView.appendChild(option.cloneNode(true));
        }
    
        // 現在の年を初期選択
        yearSelect.value = currentYear;
        yearSelectView.value = currentYear;
    }
    

    document.getElementById("postForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const content = document.getElementById("postContent").value.trim();
        const year = document.getElementById("postYear").value;
        const month = document.getElementById("postMonth").value;

        if (content === "") {
            alert("投稿内容を入力してください。");
            return;
        }

        const newPost = {
            content: content,
            year: year,
            month: month,
            likes: 0,
            id: `post-${Date.now()}`
        };

        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));
        displayPosts();
        document.getElementById("postForm").reset();
    });

    function displayPosts() {
        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = "";

        const selectedYear = document.getElementById("yearSelect").value;
        const selectedMonth = document.getElementById("monthSelect").value;

        const filteredPosts = posts.filter(post => {
            return post.year == selectedYear && post.month == selectedMonth;
        });

        if (filteredPosts.length === 0) {
            const noPostsMessage = document.createElement("p");
            noPostsMessage.textContent = "指定された年月の投稿はありません。";
            postsContainer.appendChild(noPostsMessage);
            return;
        }

        filteredPosts.sort((a, b) => b.likes - a.likes);

        filteredPosts.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.className = "post";

            const postTitle = document.createElement("h3");
            postTitle.textContent = `${post.year}年${post.month}月の投稿`;
            postDiv.appendChild(postTitle);

            const postContent = document.createElement("p");
            postContent.textContent = post.content;
            postDiv.appendChild(postContent);

            const likeSection = document.createElement("div");
            likeSection.className = "like-section";

            const likeBtn = document.createElement("button");
            likeBtn.className = "like-btn";
            likeBtn.addEventListener("click", () => handleLikeButtonClick(post));
            likeSection.appendChild(likeBtn);

            const likeCount = document.createElement("span");
            likeCount.className = "like-count";
            likeCount.textContent = `いいね: ${post.likes}`;
            likeSection.appendChild(likeCount);

            postDiv.appendChild(likeSection);
            postsContainer.appendChild(postDiv);
        });
    }

    function handleLikeButtonClick(post) {
        if (likedPosts.includes(post.id)) {
            post.likes--;
            likedPosts = likedPosts.filter(id => id !== post.id);
        } else {
            post.likes++;
            likedPosts.push(post.id);
        }

        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
        localStorage.setItem("posts", JSON.stringify(posts));
        displayPosts();
    }

    function showViewPostsSection() {
        postSection.style.display = "none";
        viewSection.style.display = "block";
        topPostsSection.style.display = "none";
        backToPostButton.style.display = "block";
        displayPosts();
    }

    function showPostSection() {
        postSection.style.display = "block";
        viewSection.style.display = "none";
        topPostsSection.style.display = "none";
        backToPostButton.style.display = "none";
    }

    // トップ投稿を表示する処理
    function showTopPostsSection() {
        postSection.style.display = "none";
        viewSection.style.display = "none";
        topPostsSection.style.display = "block";
        backToPostButton.style.display = "block";

        const topPostsContainer = document.getElementById("topPostsContainer");
        topPostsContainer.innerHTML = "";

        const topPosts = getTopPostsByLikes();
        topPosts.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.className = "post";

            const postTitle = document.createElement("h3");
            postTitle.textContent = `${post.year}年のトップ投稿`;
            postDiv.appendChild(postTitle);

            const postContent = document.createElement("p");
            postContent.textContent = post.content;
            postDiv.appendChild(postContent);

            const likeCount = document.createElement("span");
            likeCount.className = "like-count";
            likeCount.textContent = `いいね: ${post.likes}`;
            postDiv.appendChild(likeCount);

            topPostsContainer.appendChild(postDiv);
        });
    }

    // 各年の最もいいね数が多い投稿を取得
    function getTopPostsByLikes() {
        const postsGroupedByYear = {};

        posts.forEach(post => {
            if (!postsGroupedByYear[post.year]) {
                postsGroupedByYear[post.year] = [];
            }
            postsGroupedByYear[post.year].push(post);
        });

        const topPosts = [];
        for (const year in postsGroupedByYear) {
            const yearPosts = postsGroupedByYear[year];
            const topPost = yearPosts.reduce((maxPost, currentPost) => {
                return currentPost.likes > maxPost.likes ? currentPost : maxPost;
            });
            topPosts.push(topPost);
        }

        return topPosts;
    }

    // イベントリスナーの設定
    backToViewPostsButton.addEventListener("click", showViewPostsSection);
    document.getElementById("viewPostsButton").addEventListener("click", showViewPostsSection);
    document.getElementById("goToDate").addEventListener("click", displayPosts);
    backToPostButton.addEventListener("click", showPostSection);
    document.getElementById("goToTopPostsButton").addEventListener("click", showTopPostsSection);

    populateYearAndMonth();
    showViewPostsSection();
});
