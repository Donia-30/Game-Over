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
            const gameCard = new GameCard(game);
            gamesList.innerHTML += gameCard.render();
        });
    }
}

class GameCard {
    constructor(game) {
        this.game = game;
    }

    getShortDescription() {
        return this.game.short_description.split(' ').slice(0, 7).join(' ') + '...';
    }

    render() {
        return `
            <div class="col-lg-3 col-md-6">
                <div class="card bg-transparent" data-bs-toggle="modal" data-bs-target="#gameDetailModal" onclick="GameDetails.showDetails(${this.game.id})">
                    <div class="card-body">
                        <figure class="position-relative">
                            <img class="card-img-top object-fit-cover h-100" src="${this.game.thumbnail}" alt="${this.game.title}">
                        </figure>
                        <figcaption>
                            <div class="card-header d-flex justify-content-between">
                                <h3 class="text-white fs-5">${this.game.title}</h3>
                                <span class="text-bg-primary">Free</span>
                            </div>
                            <p class="card-text small text-center">
                                ${this.getShortDescription()}
                            </p>
                            <div class="card-footer small hstack justify-content-between">
                                <span class="badge badge-color">MMORPG</span>
                                <span class="badge badge-color">${this.game.platform}</span>
                            </div>
                        </figcaption>
                    </div>
                </div>
            </div>
        `;
    }
}
