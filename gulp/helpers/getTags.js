
import fs from 'fs';
import pubsub from 'pubsub-js';

import injectGlossaryTerms from './injectGlossaryTerms';
import waitFor from './waitFor';
import matchGroups from '../../JS-utilities/matchGroups';

function regEx(type, tagName){
	const rx = {
		//matches only with self closing tags
		selfClosing: tagName ? new RegExp('<p>{{ ?('+tagName+') ?(\\[.+?\\])? ?\\/ ?}}<\\/p>','ig') : /<p>{{ ?([a-z]+) ?(\[.+?\])? ?\/ ?}}<\/p>/ig,
		//matches open and self closing tags
		open: tagName ? new RegExp('<p>{{ ?('+tagName+') ?(\\[.+?\\])? ?\\/? ?}}<\\/p>','i') : /<p>{{ ?([a-z]+?) ?(\[.+?\])? ?\/? ?}}<\/p>/ig,
		//matches only closing tags
		close: tagName ? new RegExp('<p>{{ ?\\/ ?'+tagName+' ?}}<\\/p>','i') : /<p>{{ ?\/ ?([^}\/]*) ?\/? ?}}<\/p>/ig,
		//matches all tags, opening closing and self closing
		all: tagName ? new RegExp('<p>{{ ?\\/? ?('+tagName+') ?(\\[.+?\\])? ?\\/? ?}}<\\/p>','ig') : /<p>{{ ?\/? ?([a-z]+?) ?(\[.+?\])? ?\/? ?}}<\/p>/ig,
		//matches both the tags AND their contents (extreamly powerful but tagname is required)
		fullTag : new RegExp('(<p>{{ ?('+tagName+') ?(\\[.+?\\])? ?\\/? ?}}<\\/p>)(([\\s\\S]+?)(<p>{{ ?\\/ ?'+tagName+' ?}}<\\/p>))?','ig'),
	}
	return rx[type];
}


function getTagName(tagString){
	return /{{ ?\/? ?([a-z]*?)/i.exec(tagString)[1].trim();
}

class Tag {
	constructor({fullTag, prevHTML, index, pugMarkup, isLast, onTagReady, tagSetID}){
		this.isReady = false;

		this.fullTag = fullTag[0];
		this.open = fullTag[1];
		this.name = fullTag[2];
		this.attributeString = fullTag[3];
		this.content = fullTag[5];
		this.close = fullTag[6];
		this.prevHTML = prevHTML;

		this.isLast = isLast;
		this.tagSetID = tagSetID;

		this.isSelfClosing = typeof this.content === 'undefined';
		this.hasAttributes = typeof this.attributeString !== 'undefined';

		this.attributes = this.getAttributes();

		this.start = index;
		this.end = this.start + this.fullTag.length;

		if (this.isSelfClosing){
			onTagReady.call(this);

		} else {
			this.innerTags = this.content ? matchGroups(this.content, regEx('open')) : false;
			if (this.innerTags){
				this.content = new TagSet(this.content, pugMarkup, true, tagSetID).tags;

			//injects the glossary terms into the content
			} else if (this.name === 'content') {
				this.content = injectGlossaryTerms({
					prevHTML,
					html: this.content,
					pugMarkup,
					callback: () => {
						onTagReady.call(this);
					},
				});

			} else {
				onTagReady.call(this);
			}
		}
	}

	getAttributes(){
		if (this.hasAttributes){
			//converts attributes into a json String
			const JSONstring = this.attributeString//[ key1: `value 1` key2: `value 2` ]
				.replace(/([a-z]*) ?: ?` ?([^`]*)`/g, '"$1":"$2",')//[ "key1":"value 1", "key2":"value 2", ]
				.replace(/\[([^\]]*), ?\]/, '{$1}');//{"key1":"value 1", "key2":"value 2"}

			return JSON.parse(JSONstring);

		} else {
			return {};
		}

	}
};

let nextTagIndex;
let inclusionEnabled = true;

export default class TagSet {
	constructor(string, pugMarkup, isNested, id){
		this.isNested =  isNested;
		this.id = id;
		this.string = string;
		this.pugMarkup = pugMarkup;
		this.tagStrings = matchGroups(string, regEx('all'), 0);
		this.openStrings = matchGroups(string, regEx('open'), 0);
		this.tags = this.getTags();
	}

	getTags(){
		let tags = [];

		this.tagCounter = 2;//I'm not sure why 2 works :/

		let closeTag = null;

		let prevHTML = '';

		let lastIndex = 0;

		if (this.tagStrings){
			this.tagStrings.forEach((tagItem, i)=>{
				const
					tagString = tagItem[0],
					tagName = tagItem[1];

				if (regEx('open').exec(tagString)){
					const
						subString = this.string.substring(lastIndex),
						thisIndex = this.string.indexOf(tagString, lastIndex),
						regResult = regEx('fullTag', tagName).exec(subString);

					const tagSet = this;

					const tag = new Tag({
						prevHTML,
						fullTag: regResult,
						index: thisIndex,
						pugMarkup: this.pugMarkup,
						isLast: i === this.tagStrings.length - 1,
						tagSetID: this.id,
						onTagReady(){
							if (!tagSet.isNested){
								const allTagsReady = tagSet.tagCounter === tagSet.openStrings.length;

								if (allTagsReady) {
									pubsub.publish('allTagsReady-'+tagSet.id, tags)
								};

								tagSet.tagCounter ++;
							}
						}
					});

					if (closeTag === null){
						tags.push(tag);

						if (tag.innerTags){
							closeTag = tag.name;
						} else if (typeof tag.content !== 'undefined') {
							prevHTML = prevHTML + tag.content;
						}
					}

					lastIndex = thisIndex;

				} else if (tagString === closeTag) {
					closeTag = null;
				}
			});
		};

		return tags;
	}

}
