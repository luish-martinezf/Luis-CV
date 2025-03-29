((doc) => {
    'use strict'

    class DesktopNavigation {
        constructor() {
            this._sections = doc.querySelectorAll('section');
            this._navLinks = doc.querySelectorAll('#page-nav a');

            this.setEvents();
        }

        setEvents() {
            const visibleMap = new Map(), self = this;

            this._observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    visibleMap.set(entry.target, {
                        isFullyVisible: entry.intersectionRatio === 1,
                        visibleArea: entry.intersectionRect.height
                    });
                });

                // Find a first visible section
                const fullyVisibleSection = [...visibleMap.entries()].find(([_, data]) => data.isFullyVisible);

                // Assign first visible section, and if not, select the section with most visible area
                const mostVisible = fullyVisibleSection || [...visibleMap.entries()].reduce((max, entry) => 
                    max[1].visibleArea > entry[1].visibleArea ? max : entry
                , [null, { visibleArea: 0 }]);

                self.selectNavLink(mostVisible[0].id);
            },
            {
                threshold: Array.from({ length: 21 }, (_, i) => i / 20)
            });

            this._sections.forEach(section => self._observer.observe(section));
        }

        removeEvents() {
            const self = this;
            this._sections.forEach(section => self._observer.unobserve(section));
        }

        selectNavLink(tag) {
            this._navLinks.forEach(link => {
                if(link.href.endsWith('#' + tag)) {
                    link.classList.add('active');
                }
                else {
                    link.classList.remove('active');
                }
            })
        }
    }

    let desktopNavigation, finisher;

    doc.addEventListener('DOMContentLoaded', () => {
        finisher = new FinisherHeader({
            "count": 10,
            "size": {
                "min": 1300,
                "max": 1500,
                "pulse": 0
            },
            "speed": {
                "x": {
                    "min": 0.6,
                    "max": 3
                },
                "y": {
                    "min": 0.6,
                    "max": 3
                }
            },
            "colors": {
                "background": "#01070a",
                "particles": [
                    "#01070a",
                    "#46656f",
                    "#8fabb7"
                ]
            },
            "blending": "overlay",
            "opacity": {
                "center": 0.6,
                "edge": 0
            },
            // "skew": -2.4,
            "shapes": [
                "c"
            ]
        });

        const mql = window.matchMedia("(min-width: 992px)");

        if(mql.matches) {
            desktopNavigation = new DesktopNavigation();
        }

        mql.addEventListener("change", (event) => {
            if (event.matches) {
                if(desktopNavigation) {
                    desktopNavigation.setEvents();
                }
                else {
                    desktopNavigation = new DesktopNavigation();
                }
            }
            else {
                desktopNavigation.removeEvents();
            }
        });
    });
})(document)
