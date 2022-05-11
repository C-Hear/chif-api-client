import fs from "fs/promises";
import inquirer from "inquirer";

const isUuid = (answer) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(answer) || "Invalid format";

try {
  await fs.stat(".env");
} catch (e) {
  const { orgId, token } = await inquirer.prompt([{
    name: "orgId",
    message: "Please enter your orgId:",
    validate: isUuid,
  }, {
    name: "token",
    message: "Please enter your API token:",
    validate: isUuid,
  }]);

  await fs.writeFile(".env", `
CHIF_ORG_ID=${orgId}
CHIF_API_TOKEN=${token}
`.trimStart(), "utf-8");
}

console.log('Installation complete!');
