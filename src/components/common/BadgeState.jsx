const configEstados = {
    PENDING: {
        texto:'Pendiente',
        classes:`bg-status-pending-bg text-status-pending-text border-status-pending-text/20`,
        dotColor: 'bg-status-pending-text'
    },
    APPROVED_FULL: {
        texto:'Aprobado Total',
        classes:`bg-status-approved-bg text-status-approved-text border-status-approved-text/20`,
        dotColor: 'bg-status-approved-text'
    },
    APPROVED_PARTIAL: {
        texto:'Aprobado Parcial',
        classes:`bg-status-approved-bg text-status-approved-text border-dashed border-status-approved-text/40`,
        dotColor: 'bg-status-approved-text'
    },
    REJECTED: {
        texto:'Pendiente',
        classes:`bg-status-rejected-bg text-status-rejected-text border-status-rejected-text/20`,
        dotColor: 'bg-status-rejected-text'
    },
}



export default function BadgeState({estado}) {
    const config = configEstados[estado]||{
        texto: estado || 'Desconocido',
        classes:`bg-surface-container text-on-surface-variant border-outline-variant`,
        dotColor:'bg-outline'
    }
  return (
    <span className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold border transition-colors ${config.classes}`}> 
    <span className={`w-2 h-2 rounded-full mr-1.5 ${config.dotColor}`}> </span>
      {config.texto}
    </span>
  )
}
