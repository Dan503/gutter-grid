
import pug from 'pug';

//import termsList from '../../src/_0_data/acronymGlossary.json';
import matchGroups from '../../JS-utilities/matchGroups';

function sortByLength(array){
	return array.sort((a, b) => b.length - a.length);
}

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge_objects(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname.toLowerCase()] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname.toLowerCase()] = obj2[attrname]; }
    return obj3;
}

export default function injectGlossaryTerms({
	html = `<p>The continuing objective of delivering sound policy and programs to the communications and arts sectors has gained an additional dimension: finding synergies between the arts and communications sectors that could benefit Australia and Australians. Our starting point in 2015&ndash;16 was necessarily with different departmental areas&rsquo; internal systems and governance. In 2016&ndash;17, the focus will be on possible synergies between the policies and programs that engage with the sectors and affect consumers.</p><p>This year&rsquo;s annual report contains the performance statement required under the <em>Public Governance, Performance and Accountability Act 2013</em>, explaining the nature and impact of the Department&rsquo;s work. It reflects something of the incredibly broad scope of work in the Department. It reinforces the fact that the work undertaken by this Department, often with the assistance of portfolio agencies, affects the quality of life of all Australians, and is fundamental to preserving our history and building a future of innovation, creativity and economic growth.</p><p>The Department&rsquo;s most visible work has centred on the extension of 21<sup>st</sup> century infrastructure across Australia. In addition to maintaining policy and regulatory settings, the Department monitors the work of NBN Co Ltd and provides advice to the Minister for Communications as one of the two shareholder ministers. During 2015&ndash;16, the National Broadband Network increased the deployment of fixed, wireless and satellite infrastructure so that NBN connections were available for 25 per cent of Australian homes and premises.&nbsp;The first of two Sky Muster satellites was launched on 1 October 2015. &nbsp;</p><p>The Regional Telecommunications Review conducted in 2015 confirmed the importance of broadband for regional Australia, but also strongly signalled the continuing need for mobile coverage in rural and regional Australia. In 2015&ndash;16, the Department started the build phase of round 1 of the Mobile Black Spot Program, and called for further locations to be nominated in round 2. The new and upgraded mobile base stations provided by the Mobile Black Spot Program are co-funded by state, and in some cases, local governments: an excellent example of the different levels of government working together.</p><p>The Department&rsquo;s work also focuses on the nation&rsquo;s arts infrastructure&mdash;the institutions that deliver arts and cultural experiences to all Australians. In 2015-16 the Department delivered the first round of the Catalyst&mdash;<em>Australian Arts and Culture Fund</em>, which will provide $23 million over four years for more than 125 projects. Catalyst will give priority to projects by small to medium arts organisations, and to those in regional areas. Other programs run by the Department contribute to a platform for vibrant arts and cultural experiences for Australia, through our national galleries, library and museums, regional arts programs, the training of elite performers, and support for creators, screen production and funding Indigenous arts and languages.</p><p>Both the communication and arts sectors are being impacted by digital disruption. The pace of technological change is rapid. While technology is helping to connect more people to essential services like education and health, it is at the same time challenging traditional business models and regulatory arrangements. These issues underpinned the review of the Australian Communications and Media Authority (ACMA), with the Department examining the objectives, function, structure, governance and resources of the ACMA so it remains fit-for-purpose.</p><p>Similarly driven by market and technological change in the broadcasting sector, the Department worked on media reform to enable broadcasting to remain competitive and deliver local content to Australian audiences. The Department prepared amendments to provisions in the <em>Broadcasting Services Act 1992</em> that prevent a person from controlling:</p><ul> <li>commercial television licences that collectively reach in excess of 75 per cent of the Australian population (the '75 per cent audience reach rule'); and</li><li>more than two of the three regulated forms of media (commercial radio, commercial TV and associated newspapers) in the one commercial radio licence area (the '2 out of 3 rule').</li></ul><p>In addition, the Department prepared regulatory changes that will protect and enhance the amount of local television content&nbsp;in regional Australia as well as introducing an incentive for local content to be filmed in the local area. Although the legislation lapsed when Parliament was prorogued, it is expected to be re-introduced early in the new sitting period.</p>`,
	prevHTML = '',
	callback,
	pugMarkup
}){

		let returnVal = html;

		let contentString = prevHTML + html;
		const contentStart = prevHTML.length;

		const allTerms = termsList.Acronyms; //merge_objects(termsList.Glossary, termsList.Acronyms);

		const sortedTerms = sortByLength(Object.keys(allTerms));

		let terms = [];
		let safeTerms = [];

		class Term {
			constructor(term, startFrom = 0){
				//regEx ensures only whole words are matched
				this.regEx = new RegExp('(.{0,5}\\b)('+term+')(\\b.{0,5})', 'g');
				this.regResult = this.regEx.exec(contentString);
				this.start = 0;
				this.end = 0;

				if (this.regResult !== null){

					this.applyAttributes();

					const outOfRange = this.regResult !== null && this.regResult.index < startFrom;

					if (outOfRange){
						this.nextMatch(startFrom);
					}
				}
			}

			applyAttributes(){
				if (this.regResult !== null){
					this.full = this.regResult[0];
					this.before = this.regResult[1];
					this.string = this.regResult[2];
					this.after = this.regResult[3];
					this.start = this.regResult.index;
					this.charCount = this.full.length;
					this.end = this.start + this.charCount;
					this.definition = allTerms[this.string];

					//console.log(this.string, this.definition)

				} else {
					this.full = null;
					this.before = null;
					this.string = null;
					this.after = null;
					this.start = null;
					this.charCount = null;
					this.end = null;
					this.definition = null;
					this.context = null;
				}
				return this;
			}

			isInside(){
				if (this === null || this.regResult === null) return false;
				const allHTMLtags = matchGroups(html, /.{0,5}<([A-z0-9]+).*?>.{0,5}/gi);

				if (allHTMLtags){
					//if inside the brackets of a html tag
					for (var i = 0; i < allHTMLtags.length; i++) {
						const htmlTag = allHTMLtags[i];
						const isInside = this.start >= htmlTag.index && this.end <= htmlTag[0].length + htmlTag.index;
						if (isInside) return true;
					};
				}

				//if inside a longer search term
				for (let i = 0; i < terms.length; i++){
					const testTerm = terms[i];
					const isInside = this.start >= testTerm.start && this.end <= testTerm.end;
					if (isInside && this.string !== testTerm.string) return true;
				}

				return false;
			}

			nextMatch(startFrom = this.end){
				while (this.start < startFrom){
					//keep looking for matches until
					this.regResult = this.regEx.exec(contentString);
					this.applyAttributes();
				}
				return this;
			}

			injectMarkup(){
				const newPugMarkup = pugMarkup.replace('#{term}', this.string).replace("#{definition || 'Definition not found'}", this.definition);
				const replacementMarkup = this.before + pug.render(newPugMarkup) + this.after;

				contentString = contentString.replace(this.full, replacementMarkup);
			}
		}

		//get all the terms that are in the page content that are within range of the current content tags
		sortedTerms.forEach((item)=>{
			const term = new Term(item);
			if (term.regResult !== null){
				if (term.start >= contentStart){
					terms.push(term);
				}
			}
		});

		terms.forEach((term, i)=>{
			if (!term.isInside()){
				safeTerms.push(term);
			} else {
				while (term.isInside()){
					term.nextMatch();
				}
				if (term.string !== null){
					safeTerms.push(term);
				}
			}
		});

		let indexOffset = 0;
		let replacements = [];

		safeTerms.sort((a,b)=> a.start - b.start);


		safeTerms.forEach((term, i)=>{
			term.injectMarkup();
		});

		if (callback) callback.call(this, safeTerms);

		return contentString.substring(contentStart);
}
