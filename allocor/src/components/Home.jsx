import { useEffect, useRef } from 'react'
import '../styles/home_styles.scss'
import Team from './Team';

export default function Home() {
    const canvasRef = useRef(null);
    const tubesAppRef = useRef(null);

    useEffect(() => {
        var header = document.getElementById('myHeader');
        var page = document.getElementById('page');
        var openMenuButton = document.getElementById('openmenu');

        const handleScroll = function() {
            page.classList.remove('menuopen');
            if (window.scrollY >= 100) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }

            // // Show/hide canvas based on scroll position
            // const allocorSection = document.getElementById('allocor');
            // const canvas = canvasRef.current;
            
            // if (allocorSection && canvas) {
            //     const rect = allocorSection.getBoundingClientRect();
            //     const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            //     canvas.style.opacity = isVisible ? '1' : '0';
            // }
        };

        const handleMenuClick = function() {
            header.classList.remove('sticky');
            page.classList.add('menuopen');
        };

        window.addEventListener('scroll', handleScroll);
        openMenuButton.addEventListener('click', handleMenuClick);
        
        // Initial check for canvas visibility
        handleScroll();
        
        var links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                var targetId = this.getAttribute('href');
                var targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            openMenuButton.removeEventListener('click', handleMenuClick);
        };
    }, [])

    useEffect(() => {
        const loadTubesCursor = async () => {
            try {
                const TubesCursor = (await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js')).default;
                
                if (canvasRef.current && !tubesAppRef.current) {
                    tubesAppRef.current = TubesCursor(canvasRef.current, {
                        tubes: {
                            colors: ["#f967fb", "#53bc28", "#6958d5"],
                            lights: {
                                intensity: 200,
                                colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
                            }
                        }
                    });

                    const randomColors = (count) => {
                        return new Array(count)
                            .fill(0)
                            .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
                    };

                    const handleClick = () => {
                        if (tubesAppRef.current) {
                            const colors = randomColors(3);
                            const lightsColors = randomColors(4);
                            tubesAppRef.current.tubes.setColors(colors);
                            tubesAppRef.current.tubes.setLightsColors(lightsColors);
                        }
                    };

                    document.body.addEventListener('click', handleClick);

                    return () => {
                        document.body.removeEventListener('click', handleClick);
                    };
                }
            } catch (error) {
                console.error('Failed to load TubesCursor:', error);
            }
        };

        loadTubesCursor();

        return () => {
            if (tubesAppRef.current && tubesAppRef.current.destroy) {
                tubesAppRef.current.destroy();
            }
        };
    }, []);

    return (
        <>
            <header id="myHeader" className="">
                <img id="logo" src="logos/allocor.png" alt="allocor logo" />
                <nav>
                    <a href="#allocor">allocor</a>
                    <a href="#idk1">idk1</a>
                    <a href="#idk2">idk2</a>
                    <a href="#team">team</a>
                    <button id="openmenu">
                        <span></span>
                        <span></span>
                    </button>
                </nav>
            </header>
            <div id="page" className="">
                <section id="allocor">
                    <canvas ref={canvasRef} id="tubes-canvas"></canvas>
                    <h1>allocor.</h1>
                </section>
                <section id="idk1">
                    <h1>idk1.</h1>
                </section>
                <section id="idk2">
                    <h1>idk2.</h1>
                </section>
                <section id="team">
                    <Team/>
                </section>
            </div>
        </>
    )
}