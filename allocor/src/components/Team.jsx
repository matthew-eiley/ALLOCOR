import { useEffect } from 'react'
import '../styles/team_styles.scss'


export default function Team() {
    useEffect(() => {
        let progress = 20
        let startX = 0
        let active = 0
        let isDown = false

        // const speedWheel = 0.02
        const speedWheel = 0.1
        const speedDrag = -0.1

        const getZindex = (array, index) =>
        array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)))

        const $items = document.querySelectorAll('.carousel-item')
        const $cursors = document.querySelectorAll('.cursor')

        const displayItems = (item, index, active) => {
        const zIndex = getZindex([...$items], active)[index]
        item.style.setProperty('--zIndex', zIndex)
        item.style.setProperty('--active', (index - active) / $items.length)
        }

        const animate = () => {
        progress = Math.max(0, Math.min(progress, 100))
        active = Math.floor((progress / 100) * ($items.length - 1))
        $items.forEach((item, index) => displayItems(item, index, active))
        }
        animate()

        $items.forEach((item, i) => {
        item.addEventListener('click', () => {
            progress = (i / $items.length) * 100 + 10
            animate()
        })
        })

        const handleWheel = (e) => {
        const wheelProgress = e.deltaY * speedWheel
        progress = progress + wheelProgress
        animate()
        }

        const handleMouseMove = (e) => {
        if (e.type === 'mousemove') {
            $cursors.forEach(($cursor) => {
            $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
            })
        }
        if (!isDown) return
        const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
        const mouseProgress = (x - startX) * speedDrag
        progress = progress + mouseProgress
        startX = x
        animate()
        }

        const handleMouseDown = (e) => {
        isDown = true
        startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
        }

        const handleMouseUp = () => {
        isDown = false
        }

        // Attach listeners
        document.addEventListener('mousewheel', handleWheel)
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('touchstart', handleMouseDown)
        document.addEventListener('touchmove', handleMouseMove)
        document.addEventListener('touchend', handleMouseUp)

        // Cleanup on unmount
        return () => {
        document.removeEventListener('mousewheel', handleWheel)
        document.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchstart', handleMouseDown)
        document.removeEventListener('touchmove', handleMouseMove)
        document.removeEventListener('touchend', handleMouseUp)
        }
    }, [])

    return (
        <>
            <div className="carousel">
                <div className="carousel-item">
                    <div className="carousel-box">
                        <div className="title">Matthew Eiley</div>
                        <div className="num">U3</div>
                        <img src="/team_members/matthew.jpg" alt="matthew" />
                    </div>
                </div>

                <div className="carousel-item">
                    <div className="carousel-box">
                        <div className="title">Mario Ghorayeb</div>
                        <div className="num">U3</div>
                        <img src="/team_members/mario.jpg" alt="mario" />
                    </div>
                </div>

                <div className="carousel-item">
                    <div className="carousel-box">
                        <div className="title">Trevor Piltch</div>
                        <div className="num">U3</div>
                        <img src="/team_members/trevor.jpg" alt="trevor" />
                    </div>
                </div>

                <div className="carousel-item">
                    <div className="carousel-box">
                        <div className="title">Yixuan Qin</div>
                        <div className="num">U4</div>
                        <img src="/team_members/yixuan.jpg" alt="yixuan" />
                    </div>
                </div>

                <div className="carousel-item">
                    <div className="carousel-box">
                        <div className="title">Boris Vassilev</div>
                        <div className="num">U3</div>
                        <img src="/team_members/boris.jpg" alt="boris" />
                    </div>
                </div>

                <div className="carousel-item">
                    <div className="carousel-box">
                        <div className="title">Youdas Yessad</div>
                        <div className="num">U3</div>
                        <img src="/team_members/youdas.jpg" alt="youdas" />
                    </div>
                </div>

                <div className="carousel-item">
                    <div className="carousel-box">
                        <div className="title">Member 7</div>
                        <div className="num">07</div>
                        <img src="/team_members/idk.jpg" alt="idk7" />
                    </div>
                </div>

                <div className="carousel-item">
                    <div className="carousel-box">
                        <div className="title">Member 8</div>
                        <div className="num">08</div>
                        <img src="/team_members/idk.jpg" alt="idk8" />
                    </div>
                </div>

                <div className="carousel-item">
                    <div className="carousel-box">
                        <div className="title">Member 9</div>
                        <div className="num">09</div>
                        <img src="/team_members/idk.jpg" alt="idk9" />
                    </div>
                </div>
                <div className="carousel-item">
                    <div className="carousel-box">
                        <div className="title">Member 10</div>
                        <div className="num">10</div>
                        <img src="/team_members/idk.jpg" alt="idk10" />
                    </div>
                </div>
            </div>

            <div className="cursor"></div>
            <div className="cursor cursor2"></div>
        </>
    )
}