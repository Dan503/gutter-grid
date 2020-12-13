/** http://stackoverflow.com/a/31610900/1611058 */
export default function callPlayer(iframeID, func, args) {
	var i = 0,
		iframe = document.getElementById(iframeID),
		src = iframe.getAttribute('src');

	iframe.contentWindow.postMessage(
		JSON.stringify({
			event: 'command',
			func: func,
			args: args || [],
		}),
		'*'
	);
}
