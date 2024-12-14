class GameService {
    static async fetchGameDetails(gameId) {
        const response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '35b6715592msh810ed7e9f9b5aa1p11af2cjsne91642156c66',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        });
        return await response.json();
    }

    static async fetchGamesByCategory(category) {
        const response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '35b6715592msh810ed7e9f9b5aa1p11af2cjsne91642156c66',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        });
        const data = await response.json();
        return data.map(gameData => new Game(gameData));
    }
}

class Game {
    constructor(gameData) {
        this.title = gameData.title;
        this.thumbnail = gameData.thumbnail;
        this.description = gameData.short_description;
        this.platform = gameData.platform;
        this.genre = gameData.genre;
        this.id = gameData.id;
    }

    getShortDescription() {
        return this.description.split(' ').slice(0, 7).join(' ') + '...';
    }

    renderCard() {
        return `
            <div class="col-lg-3 col-md-6">
                <div class="card bg-transparent" data-bs-toggle="modal" data-bs-target="#gameDetailModal" onclick="GameDetails.showDetails(${this.id})">
                    <div class="card-body">
                        <figure class="position-relative">
                            <img class="card-img-top object-fit-cover h-100" src="${this.thumbnail}" alt="${this.title}">
                        </figure>
                        <figcaption>
                            <div class="card-header d-flex justify-content-between">
                                <h3 class="text-white fs-5">${this.title}</h3>
                                <span class="text-bg-primary">Free</span>
                            </div>
                            <p class="card-text small text-center">
                                ${this.getShortDescription()}
                            </p>
                            <div class="card-footer small hstack justify-content-between">
                                <span class="badge badge-color">${this.genre}</span>
                                <span class="badge badge-color">${this.platform}</span>
                            </div>
                        </figcaption>
                    </div>
                </div>
            </div>
        `;
    }
}

class UI {
    static showLoadingAnimation() {
        document.getElementById('loading-animation').style.visibility = 'visible';
    }

    static hideLoadingAnimation() {
        document.getElementById('loading-animation').style.visibility = 'hidden';
    }

    static updateGamesList(games) {
        const gamesList = document.getElementById('games-list');
        gamesList.innerHTML = '';

        games.forEach(game => {
            gamesList.innerHTML += game.renderCard();
        });
    }

    static displayGameDetails(gameDetails) {
        const gameDetailModal = `
            <div class="game-detail-modal">
                <div class="modal-content">
                    <div class="close-btn" onclick="UI.closeModal()">&times;</div>

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
        UI.hideLoadingAnimation();
    }

    static closeModal() {
        const modal = document.querySelector('.game-detail-modal');
        if (modal) {
            modal.remove();
        }
        document.getElementById('games-list').style.display = 'flex';
    }
}

class GameDetails {
    static async showDetails(gameId) {
        UI.showLoadingAnimation();
        const gameDetails = await GameService.fetchGameDetails(gameId);
        UI.displayGameDetails(gameDetails);
    }
}

class Navigation {
    static initializeCategoryLinks() {
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', async function (e) {
                e.preventDefault();
                const category = link.getAttribute('data-category');
                UI.showLoadingAnimation();
                const games = await GameService.fetchGamesByCategory(category);
                UI.updateGamesList(games);
                UI.hideLoadingAnimation();
            });
        });
    }

    static initializeDefaultCategory() {
        window.onload = async function () {
            UI.showLoadingAnimation();
            const games = await GameService.fetchGamesByCategory('mmorpg');
            UI.updateGamesList(games);
            UI.hideLoadingAnimation();
        };
    }
}

// Initialize app
Navigation.initializeCategoryLinks();
Navigation.initializeDefaultCategory();
