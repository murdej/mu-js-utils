
export class StrParser
{
	protected str : string;

	public position : number = 0;

	public lastMark : StrParserMark|null = null;

	public debugMode : boolean = false;

	constructor(str : string) {
		this.str = str;
	}

	public findNext(chunk : string|string[], skipChunk : boolean = false) : StrParserMark|null
	{
		if (typeof chunk === "string") chunk = [chunk];
		// let firstPos : number|null = null;
		let firstPos : number|null = null;
		let firstChunk : string|null = null;
		let firstChunkNum : number = 0;
		let i = 0;
		for(const ch of chunk)
		{
			const pos = this.str.indexOf(ch, this.position);
			if (pos > -1 && (firstPos === null || pos < firstPos))
			{
				firstPos = pos;
				firstChunk = ch;
				firstChunkNum = i;
			}
			i++;
		}
		if (firstChunk)
		{
			if (skipChunk) firstPos! += firstChunk.length;
			this.position = firstPos!;
			this.lastMark = {
				chunk: firstChunk,
				chunkNum: firstChunkNum,
				position: firstPos!
			};
			this._onEndChunk = false;
			this.debug("findNext(", chunk, ") > '" + firstChunk + "', " + this.position);
			return this.lastMark;
		} else {
			this.debug("findNext(", chunk, ") not found " + this.position);
			return null;
		}
	}

	public substring(start : StrParserMark|number|string|null = null, stop : StrParserMark|number|string|null = null) : string
	{
		if (start === null) start = this.position;
		else if (typeof start === "string") start = this.loadPos(start)
		else if (typeof start !== "number") start = start.position;

		if (stop === null) stop = this.str.length;
		else if (typeof stop === "string") stop = this.loadPos(stop)
		else if (typeof stop !== "number") stop = stop.position;

		const res = this.str.substring(start, stop);
		this.debug("substr " + start + ":" + stop + " > " + res);
		return res;
	}

	public moverel(mov : number) : StrParserMark
	{
		const newPos = this.position + mov;
		this.position = Math.min(this.str.length, Math.max(0, newPos));
		return { position: this.position };
	}

	public pos()
	{
		return { position: this.position };
	}

	protected storedPositions: Record<string, number> = {};

	public loadPos(name: string): number
	{
		if (name === '.') return this.position;
		else if (name === '>') return this.str.length;
		return this.storedPositions[name];
	}

	public savePos(name: string): void
	{
		this.storedPositions[name] = this.position;
	}

	protected _onEndChunk = false;
	public toEndChunk()
	{
		const l = this._onEndChunk ? 0 : (this.lastMark?.chunk?.length || 0);
		this.moverel(l);
		this._onEndChunk = true;
		this.debug("toEndChunk +" + l.toString());
	}

	protected debug(...msgs : any)
	{
		if (this.debugMode)
		{
			const msg = msgs.map((ch: any) => typeof ch === "string" ? ch : JSON.stringify(ch)).join('');
			// console.log(msg + "\n	" + this.position + "	%c" + this.str.substring(0, this.position) + "%c" + this.str.substring(this.position), "background: green; color: white", "color: blue");
			console.log(msg + "\n	" + this.position + "	" + this.str.substring(0, this.position) + "|" + this.str.substring(this.position));
		}
	}

	public isEnd() : boolean
	{
		return this.position >= this.str.length;
	}

	public startsWith(chunk : string|string[], skipChunk : boolean = false, saveLast: boolean = true) : StrParserMark|null
	{
		if (typeof chunk === "string") chunk = [chunk];
		// let firstPos : number|null = null;
		let firstPos : number|null = null;
		let firstChunk : string|null = null;
		let firstChunkNum : number = 0;
		let i = 0;
		for(const ch of chunk)
		{
			const stw = this.str.startsWith(ch, this.position);
			if (stw)
			{
				const mark = {
					chunk: ch,
					chunkNum: i,
					position: this.position
				}
				if (saveLast) this.lastMark = mark;
				if (skipChunk) this.position += ch.length;
				this.debug("startsWith(", chunk, ") > '" + ch + "'");
				return mark;
			}
			i++;
		}
		this.debug("startsWith(", chunk, ") > not found");
		return null;
	}

	public skipChunks(chunks: string[]) {
		while (this.startsWith(chunks, true, false));
	}
}

export type StrParserMark = {
	chunk? : string,
	chunkNum? : number,
	position : number
}

