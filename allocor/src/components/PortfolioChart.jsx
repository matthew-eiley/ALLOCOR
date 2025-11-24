import { useState, useRef } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  Brush,
  ReferenceArea,
} from "recharts"

const generateSampleData = () => {
  const data = []
  const startDate = new Date("2025-01-01")
  const startValue = 10000

  // Generate 365 days of data for better scrolling/zooming
  for (let i = 0; i < 329; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    const randomChange = (Math.random() - 0.45) * 200
    const value = i === 0 ? startValue : data[i - 1].value + randomChange

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullDate: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      value: Math.round(value * 100) / 100,
      timestamp: date.getTime(),
      index: i,
    })
  }

  return data
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const change = payload[0].payload.index > 0
      ? value - 10000
      : 0
    const changePercent = ((change / 10000) * 100).toFixed(2)

    return (
      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: "12px",
        border: "1px solid #53bc28",
        borderRadius: "4px",
        color: "white",
      }}>
        <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#aaa" }}>{label}</p>
        <p style={{ margin: "0", fontSize: "16px", fontWeight: "bold" }}>
          ${value.toLocaleString()}
        </p>
        <p style={{
          margin: "4px 0 0 0",
          fontSize: "12px",
          color: change >= 0 ? "#53bc28" : "#ff4444"
        }}>
          {change >= 0 ? "+" : ""}${change.toLocaleString()} ({change >= 0 ? "+" : ""}{changePercent}%)
        </p>
      </div>
    )
  }
  return null
}

export default function PortfolioChart() {
  const [data] = useState(generateSampleData())
  const [activeIndex, setActiveIndex] = useState(null)
  const [timeRange, setTimeRange] = useState('ALL')
  const [refAreaLeft, setRefAreaLeft] = useState('')
  const [refAreaRight, setRefAreaRight] = useState('')
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(data.length - 1)
  const [isZooming, setIsZooming] = useState(false)

  // Calculate time range boundaries
  const getTimeRangeData = () => {
    const endIndex = data.length - 1
    let startIndex = 0

    switch(timeRange) {
      case '1M':
        startIndex = Math.max(0, endIndex - 30)
        break
      case '3M':
        startIndex = Math.max(0, endIndex - 90)
        break
      case '6M':
        startIndex = Math.max(0, endIndex - 180)
        break
      case '1Y':
        startIndex = Math.max(0, endIndex - 365)
        break
      case 'ALL':
      default:
        startIndex = 0
        break
    }

    return { startIndex, endIndex }
  }

  const { startIndex, endIndex } = getTimeRangeData()
  const visibleData = data.slice(Math.max(0, left), Math.min(data.length, right + 1))

  const currentValue = visibleData[visibleData.length - 1]?.value || 0
  const startValue = visibleData[0]?.value || 0
  const totalChange = currentValue - startValue
  const totalChangePercent = startValue !== 0 ? ((totalChange / startValue) * 100).toFixed(2) : '0.00'

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('')
      setRefAreaRight('')
      return
    }

    // Ensure left is less than right
    let leftIndex = refAreaLeft
    let rightIndex = refAreaRight

    if (leftIndex > rightIndex) {
      [leftIndex, rightIndex] = [rightIndex, leftIndex]
    }

    setLeft(leftIndex)
    setRight(rightIndex)
    setRefAreaLeft('')
    setRefAreaRight('')
    setIsZooming(false)
    setTimeRange('CUSTOM')
  }

  const zoomOut = () => {
    setLeft(0)
    setRight(data.length - 1)
    setTimeRange('ALL')
  }

  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
    const { startIndex, endIndex } = range === 'ALL'
      ? { startIndex: 0, endIndex: data.length - 1 }
      : getTimeRangeForButton(range)
    setLeft(startIndex)
    setRight(endIndex)
  }

  const getTimeRangeForButton = (range) => {
    const endIndex = data.length - 1
    let startIndex = 0

    switch(range) {
      case '1M':
        startIndex = Math.max(0, endIndex - 30)
        break
      case '3M':
        startIndex = Math.max(0, endIndex - 90)
        break
      case '6M':
        startIndex = Math.max(0, endIndex - 180)
        break
      case '1Y':
        startIndex = Math.max(0, endIndex - 365)
        break
      default:
        startIndex = 0
    }

    return { startIndex, endIndex }
  }

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      boxSizing: "border-box",
      touchAction: "pan-y",
    }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 10px 0", color: "white", fontSize: "24px" }}>
          Portfolio Value Over Time
        </h2>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
          <span style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>
            ${currentValue.toLocaleString()}
          </span>
          <span style={{
            fontSize: "18px",
            color: totalChange >= 0 ? "#53bc28" : "#ff4444",
            fontWeight: "500",
          }}>
            {totalChange >= 0 ? "+" : ""}${totalChange.toLocaleString()}
            ({totalChange >= 0 ? "+" : ""}{totalChangePercent}%)
          </span>
        </div>
        <p style={{ margin: "8px 0 0 0", color: "#aaa", fontSize: "14px" }}>
          {visibleData[0]?.fullDate} - {visibleData[visibleData.length - 1]?.fullDate}
        </p>
      </div>

      {/* Time Range Selector */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "16px",
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        {['1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
          <button
            key={range}
            onClick={() => handleTimeRangeChange(range)}
            style={{
              padding: "8px 16px",
              backgroundColor: timeRange === range ? "#53bc28" : "rgba(83, 188, 40, 0.1)",
              color: timeRange === range ? "black" : "white",
              border: `1px solid ${timeRange === range ? "#53bc28" : "rgba(83, 188, 40, 0.3)"}`,
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (timeRange !== range) {
                e.target.style.backgroundColor = "rgba(83, 188, 40, 0.2)"
              }
            }}
            onMouseLeave={(e) => {
              if (timeRange !== range) {
                e.target.style.backgroundColor = "rgba(83, 188, 40, 0.1)"
              }
            }}
          >
            {range}
          </button>
        ))}
        {(left !== 0 || right !== data.length - 1) && (
          <button
            onClick={zoomOut}
            style={{
              padding: "8px 16px",
              backgroundColor: "rgba(255, 68, 68, 0.1)",
              color: "white",
              border: "1px solid rgba(255, 68, 68, 0.3)",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255, 68, 68, 0.2)"
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(255, 68, 68, 0.1)"
            }}
          >
            Reset Zoom
          </button>
        )}
      </div>

      <div style={{
        width: "100%",
        height: "400px",
        position: "relative",
        userSelect: "none"
      }}>
        <ResponsiveContainer width="100%" height={400} style={{ cursor: isZooming ? "crosshair" : "default" }}>
          <AreaChart
            data={visibleData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                if (isZooming && refAreaLeft) {
                  setRefAreaRight(state.activeTooltipIndex)
                }
                setActiveIndex(state.activeTooltipIndex)
              }
            }}
            onMouseDown={(e) => {
              if (e && e.activeTooltipIndex !== undefined) {
                setRefAreaLeft(e.activeTooltipIndex)
                setIsZooming(true)
              }
            }}
            onMouseUp={zoom}
            onMouseLeave={() => {
              setActiveIndex(null)
              setRefAreaLeft('')
              setRefAreaRight('')
              setIsZooming(false)
            }}
          >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#53bc28" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#53bc28" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="date"
            stroke="#aaa"
            tick={{ fill: "#aaa", fontSize: 12 }}
            tickLine={{ stroke: "#333" }}
            interval={Math.floor(visibleData.length / 6)}
            allowDataOverflow
          />
          <YAxis
            stroke="#aaa"
            tick={{ fill: "#aaa", fontSize: 12 }}
            tickLine={{ stroke: "#333" }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            domain={['dataMin - 100', 'dataMax + 100']}
            allowDataOverflow
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#53bc28", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#53bc28"
            strokeWidth={2}
            fill="url(#colorValue)"
            animationDuration={300}
            dot={false}
            activeDot={{ r: 6, fill: "#53bc28", stroke: "white", strokeWidth: 2 }}
          />
          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
              fill="#53bc28"
              fillOpacity={0.3}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: "16px",
        padding: "12px",
        backgroundColor: "rgba(83, 188, 40, 0.05)",
        border: "1px solid rgba(83, 188, 40, 0.2)",
        borderRadius: "6px",
      }}>
        <p style={{ margin: "0", fontSize: "13px", color: "#aaa" }}>
          💡 <strong style={{ color: "white" }}>Interactive Controls:</strong> Click and drag on the chart to zoom into a specific date range. Use the time range buttons above to quickly jump to different periods. Click "Reset Zoom" to view all data.
        </p>
      </div>

      <div style={{
        marginTop: "20px",
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
      }}>
        <div style={{
          backgroundColor: "rgba(83, 188, 40, 0.1)",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid rgba(83, 188, 40, 0.3)",
        }}>
          <p style={{ margin: "0", fontSize: "12px", color: "#aaa" }}>Highest Value</p>
          <p style={{ margin: "4px 0 0 0", fontSize: "18px", color: "white", fontWeight: "bold" }}>
            ${Math.max(...visibleData.map(d => d.value)).toLocaleString()}
          </p>
        </div>
        <div style={{
          backgroundColor: "rgba(83, 188, 40, 0.1)",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid rgba(83, 188, 40, 0.3)",
        }}>
          <p style={{ margin: "0", fontSize: "12px", color: "#aaa" }}>Lowest Value</p>
          <p style={{ margin: "4px 0 0 0", fontSize: "18px", color: "white", fontWeight: "bold" }}>
            ${Math.min(...visibleData.map(d => d.value)).toLocaleString()}
          </p>
        </div>
        <div style={{
          backgroundColor: "rgba(83, 188, 40, 0.1)",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid rgba(83, 188, 40, 0.3)",
        }}>
          <p style={{ margin: "0", fontSize: "12px", color: "#aaa" }}>Average Value</p>
          <p style={{ margin: "4px 0 0 0", fontSize: "18px", color: "white", fontWeight: "bold" }}>
            ${(visibleData.reduce((sum, d) => sum + d.value, 0) / visibleData.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    </div>
  )
}
