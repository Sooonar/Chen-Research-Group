import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { TeamPreview } from "@/components/sections/team-preview";
import { StatsSection } from "@/components/sections/stats-section";
import { AdmissionSection } from "@/components/sections/admission-section";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const defaultSiteConfig = {
  lab_name: "数智管网・建科新能",
  lab_subtitle: "致力于前沿科学研究，推动技术创新与突破",
  lab_description:
    "我们专注于人工智能、机器学习、计算机视觉等领域的研究工作，在顶级期刊和会议上发表了多篇高水平论文，培养了一批优秀的研究生人才。",
  admission_info:
    "课题组常年招收对科研充满热情的博士研究生和硕士研究生。我们提供良好的科研环境、充足的研究经费和丰富的学术交流机会。欢迎具有计算机科学、人工智能、数学等相关背景的同学加入我们。",
  contact_email: "contact@example.com",
};

type SiteConfigKey = keyof typeof defaultSiteConfig;

async function getSiteConfig() {
  try {
    const settings = await prisma.siteSetting.findMany();

    return settings.reduce((config, setting) => {
      if (setting.key in config) {
        config[setting.key as SiteConfigKey] = setting.value;
      }

      return config;
    }, { ...defaultSiteConfig });
  } catch (error) {
    console.error("Error fetching site config:", error);
    return defaultSiteConfig;
  }
}

export default async function Home() {
  const siteConfig = await getSiteConfig();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection
          name={siteConfig.lab_name}
          subtitle={siteConfig.lab_subtitle}
          description={siteConfig.lab_description}
        />
        <StatsSection />
        <TeamPreview />
        <AdmissionSection
          admissionInfo={siteConfig.admission_info}
          contactEmail={siteConfig.contact_email}
        />
      </main>
      <Footer />
    </>
  );
}
