function assembleAI(AItype, Game){
	if (AItype == "AI2")
		return new AI2(Game);
	if(AItype == "AIC")
		return new AI3(Game);
	if (AItype == "AI5")
		return new AI5(Game);
}