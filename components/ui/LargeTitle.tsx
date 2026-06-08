interface LargeTitleProps {
    title: string
    subtitle?: string
  }
  
  export function LargeTitle({ title, subtitle }: LargeTitleProps) {
    return (
      <div className="large-title">
        <h1
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-tertiary)',
              marginTop: 2,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    )
  }