const handleDelete = (buttonId) => {
    return async () => {
        const button = document.getElementById(buttonId);
        const id = parseInt(buttonId.slice(7),10);
        console.log(id)
        try {
            const res = await fetch(`http://localhost:8080/tweets/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "TWITTER_LITE_ACCESS_TOKEN"
                    )}`,

                },
            });

            if (!res.ok) {
                throw res;
            }

            window.location.href= '/profile';
        } catch (err) {

        }
    }

}

document.addEventListener('DOMContentLoaded', async e => {
    const id = localStorage.getItem('TWITTER_LITE_CURRENT_USER_ID')
    try {
        const res = await fetch(`http://localhost:8080/users/${id}/tweets`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "TWITTER_LITE_ACCESS_TOKEN"
                )}`,
            },
        });
        if (res.status === 401) {
            window.location.href = '/log-in'
            return;
        }
        const { tweets } = await res.json();
        const tweetsContainer = document.querySelector(".tweets-container");
        const tweetsHtml = tweets.map(
            ({ message, id }) => `
      <div class="card" id="tweet-${id}">
        <div class="card-body">
          <p class="card-text">${message}</p>
          <button id="button-${id}" class="delete-button btn btn-danger">X</button>
        </div>
      </div>
    `
        );
        tweetsContainer.innerHTML = tweetsHtml.join("")
    }
    catch (err) {
        console.error(err);
    }

    const deleteButtons = document.querySelectorAll(".delete-button");
    if (deleteButtons) {
        deleteButtons.forEach((button) => {
            button.addEventListener("click", handleDelete(button.id));
        });
    }
})
