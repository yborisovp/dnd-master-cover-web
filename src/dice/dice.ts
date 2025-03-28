// dice.ts
import ky from "ky";
import { store } from "../redux/store";
import { settingsSelector } from "../redux/slice/settings.slice";

export interface DiceConfig {
  dice: number;
  sides: number;
}

export interface DiceRollResult {
  config: DiceConfig;
  results: number[];
}

// Rolls a single dice configuration and returns the DiceRollResult.
async function rollSingleDice(config: DiceConfig): Promise<DiceRollResult> {
  const { dice, sides } = config;
  const state = store.getState();
  const settings = settingsSelector(state);

  // If "useRandomOrg" is enabled and an API key is provided, use Random.org.
  if (settings.useRandomOrg && settings.randomOrgApiKey.trim() !== "") {
    try {
      const data: any = await ky
        .post("https://api.random.org/json-rpc/4/invoke", {
          json: {
            jsonrpc: "2.0",
            method: "generateIntegers",
            params: {
              apiKey: settings.randomOrgApiKey,
              n: dice,
              min: 1,
              max: sides,
              replacement: true,
            },
            id: Date.now(),
          },
        })
        .json();

      if (
        data &&
        data.result &&
        data.result.random &&
        Array.isArray(data.result.random.data)
      ) {
        return { config, results: data.result.random.data };
      } else {
        throw new Error("Invalid response from Random.org");
      }
    } catch (error) {
      console.warn(
        "Random.org request failed, falling back to Math.random:",
        error
      );
    }
  }

  // Fallback using Math.random
  const results: number[] = [];
  for (let i = 0; i < dice; i++) {
    results.push(Math.floor(Math.random() * sides) + 1);
  }
  return { config, results };
}

/**
 * Roll dice based on the provided configuration.
 * @param config A single DiceConfig or an array of DiceConfig.
 * @returns For a single config, returns a Promise resolving to a DiceRollResult.
 *          For an array of configs, returns a Promise resolving to an array of DiceRollResult.
 */
export async function rollDice(config: DiceConfig): Promise<DiceRollResult>;
export async function rollDice(config: DiceConfig[]): Promise<DiceRollResult[]>;
export async function rollDice(
  config: DiceConfig | DiceConfig[]
): Promise<DiceRollResult | DiceRollResult[]> {
  if (Array.isArray(config)) {
    const promises = config.map((conf) => rollSingleDice(conf));
    return Promise.all(promises);
  } else {
    return rollSingleDice(config);
  }
}
