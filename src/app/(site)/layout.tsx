import { BranchPickerProvider } from "@/components/site/branch-picker";
import { SiteFooter, SiteHeader, StickyBar, UtilityBar } from "@/components/site/site-chrome";
import { getBranches } from "@/lib/site-data";

/* The public site's shared layout (sprint 5.1): utility bar, navigation,
   footer and the phone sticky bar around every page. The staff area (/admin)
   is outside this group and has its own shell. Spec: Requirements_Navigation.md */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const branches = await getBranches();
  return (
    <BranchPickerProvider branches={branches}>
      <div className="site-shell flex min-h-full flex-1 flex-col">
        <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-navy" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <UtilityBar />
          <SiteHeader />
        </header>
        <main id="main" className="flex-1">{children}</main>
        <SiteFooter />
        <StickyBar />
      </div>
    </BranchPickerProvider>
  );
}
