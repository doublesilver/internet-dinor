import { getAdminSystemDiagnostics } from "@/lib/system/admin-system";
import { loadProjectEnv } from "@/lib/system/env";

function printSection(title: string) {
  console.log(`\n[${title}]`);
}

async function run() {
  loadProjectEnv();

  const diagnostics = await getAdminSystemDiagnostics();

  console.log("인터넷공룡 운영 진단");
  console.log(`- 생성 시각: ${diagnostics.generatedAt}`);
  console.log(`- 인증 모드: ${diagnostics.authMode === "supabase" ? "Supabase Auth" : "Preview Login"}`);
  console.log(`- 인증 설정: ${diagnostics.authConfigured ? "정상" : "미완료"}`);
  console.log(`- DB 상태: ${diagnostics.databaseConnection.message}`);

  printSection("체크 항목");
  for (const item of diagnostics.checks) {
    console.log(`- ${item.label}: ${item.value} [${item.status}]`);
    console.log(`  설명: ${item.description}`);
    console.log(`  조치: ${item.action}`);
  }

  printSection("데이터 건수");
  for (const item of diagnostics.dataSummary) {
    console.log(`- ${item.label}: ${item.count} (${item.source})`);
  }

  printSection("권장 조치");
  for (const item of diagnostics.recommendations) {
    console.log(`- ${item}`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
