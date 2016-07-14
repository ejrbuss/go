function assembleAI(AItype, Game){
	if (AItype == "AI1")
		return new AI1(Game);
	if (AItype == "AI2")
		return new AI2(Game);
	if (AItype == "AI3")
		return new AI3(Game);
	if (AItype == "AI5")
		return new AI5(Game);
}