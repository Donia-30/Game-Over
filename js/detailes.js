class LoadingAnimation {
    static show() {
        document.getElementById('loading-animation').style.visibility = 'visible';
    }

    static hide() {
        document.getElementById('loading-animation').style.visibility = 'hidden';
    }
}

class GameDetailModal {
    static close() {
        const modal = document.querySelector('.game-detail-modal');
        if (modal) {
            modal.remove();
        }
        // display games when close detailes
        document.getElementById('games-list').style.display = 'flex';
    }

    static async show(gameId) {
        LoadingAnimation.show();

        // hudden games when open detailes
        document.getElementById('games-list').style.display = 'none';

        const gameDetails = await GameService.fetchGameDetails(gameId);

        const gameDetailModal = `
            <div class="game-detail-modal">
                <div class="modal-content">
                    <div class="close-btn" onclick="GameDetailModal.close()">&times;</div>

                    <div class="d-flex">
                        <div>
                            <p class="title-detailes">Details Game</p>
                            <img src="${gameDetails.thumbnail}" alt="${gameDetails.title}" class="modal-image">
                        </div>
                        <div>
                            <h3><strong>Title:</strong> <span>${gameDetails.title}</span></h3>
                            <p><strong>Category:</strong> <span>${gameDetails.genre}</span></p>
                            <p><strong>Platform:</strong> <span>${gameDetails.platform}</span></p>
                            <p><strong>Status:</strong> <span>${gameDetails.status}</span></p>
                            <p><strong>Release Date:</strong> <span>${gameDetails.release_date}</span></p>
                            <p class="description">${gameDetails.description}</p>
                            <a href="${gameDetails.freetogame_profile_url}" target="_blank" class="btn">Show Game</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', gameDetailModal);
        LoadingAnimation.hide();
    }
}

class GameService {
    static async fetchGameDetails(gameId) {
        const response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '35b6715592msh810ed7e9f9b5aa1p11af2cjsne91642156c66',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        });

        const gameDetails = await response.json();
        return gameDetails;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const gameId = 1;
    GameDetailModal.show(gameId);  // display detailes game by id
});
