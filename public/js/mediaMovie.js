let medias = document.querySelectorAll(".media-container")
for (let i = 0; i < medias.length; i++) {
    let media = medias[i];
    if (media) {
        media.addEventListener("click", (e) => {
            let id = media.getAttribute("id")
            window.location = `/movie/${id}`
        })
    }
}