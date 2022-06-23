import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      es: {
        translation: {
          SELECCIONE_LA_PRIMERA_CARTA: "Seleccione la primera carta.",
					VA_A_SELECCIONAR_LA_PRIMERA_CARTA: "{{playerName}} va a seleccionar la pimera carta.",
					MUY_BIEN_SELECCIONE_LA_SIGUIENTE: "¡Muy bien! Seleccione la siguiente.",
					MUY_BIEN: "¡Muy bien!",
					OH_NO_INCORRECTO_TURNO_PARA: "¡Oh no! Incorrecto. Turno para {{playerName}}",
					MUY_BIEN_AGREGUE_UNA_CARTA_NUEVA: "¡Muy bien! Agrege una carta nueva.",
					MUY_BIEN_UNA_CARTA_MAS: "¡Muy bien! Una carta más.",
					MUY_BIEN_TURNO_PARA: '¡Muy bien! Turno para {{playerName}}',
					ERROR: "Oh oh... ha habido un error...",
					TU_NOMBRE: "Tu nombre",
					INGRESAR: "Ingresar",
					CONECTANDO: 'Conectando...',
					ME_TOCA: "me toca"
        }
      },
			zh:{
				translation: {
					SELECCIONE_LA_PRIMERA_CARTA: "请选第一张卡片",
					VA_A_SELECCIONAR_LA_PRIMERA_CARTA: "{{playerName}}将选第一张卡片",
					MUY_BIEN_SELECCIONE_LA_SIGUIENTE: "非常好！请选下一张卡片",
					MUY_BIEN: "不错！",
					OH_NO_INCORRECTO_TURNO_PARA: "糟了！错了，现在该{{playerName}}了",
					MUY_BIEN_AGREGUE_UNA_CARTA_NUEVA: "非常好！请再加一张新卡片",
					MUY_BIEN_UNA_CARTA_MAS: "不错！再加一张卡",
					MUY_BIEN_TURNO_PARA: '非常好！现在该{{playerName}}了',
					ERROR: "糟糕～ 有个错误～",
					TU_NOMBRE: "名字",
					INGRESAR: "登入",
					CONECTANDO: '链接中...',
					ME_TOCA: "该我了"
				}
			}
    }
  })

export default i18n