class OBSConnector {
	obs;
	obsConnected = false;

	constructor() {
		this.obs = new OBSWebSocket();
		this.obs.connect()
			.then(() => {
				this.obsConnected = true;
			})
			.catch(() => {
				console.log('Ошибка подключения. Проверьте настройку сервера WebSocket OBS Studio');
			});
	}

	GetCurrentProgramScene = async () => (await this.obs.call('GetCurrentProgramScene'))?.currentProgramSceneName;
	GetVideoSettings = async () => await this.obs.call('GetVideoSettings');

	async rolesInputAdd() {
		try {
			const sceneCurrentName = await this.GetCurrentProgramScene();
			const videoSettings = await this.GetVideoSettings();

			if (sceneCurrentName && videoSettings) {
				return await this.obs.call('CreateInput', {
					sceneName: sceneCurrentName,
					inputName: "Roles",
					inputKind: "browser_source",
					inputSettings: {
						url: "http://kozebojka.ru/maf-roles/roles.html",
						height: videoSettings.baseHeight,
						width: videoSettings.baseWidth,
						reroute_audio: true,
					}
				});
			}
		} catch (e) {
			console.error('Failed to add roles input:', e);
		}
	}
}

console.log(OBSWebSocket);