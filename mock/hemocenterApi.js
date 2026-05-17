const hemocentros=[{id:'h1',nome:'HEMOPE Recife',cidade:'Recife'}];
const urgencias=[{tipo:'O-',nivel:'crítico'}];
export async function getHemocentros(){return hemocentros}
export async function getUrgencias(){return urgencias}
export async function postAgendamento(payload){return {ok:true,id:`ag-${Date.now()}`,...payload}}
export async function getDisponibilidade(){return [{hemocentro:'HEMOPE Recife',slots:['08:00','10:00']}]} 
