import { SeeYouThereGrid, type SeeYouThereGridProps } from '@/components/SeeYouThereGrid'

import {
  SeeYouThereCard,
  SeeYouThereCardBadges,
  SeeYouThereCardBody,
  SeeYouThereCardFooter,
  SeeYouThereCardHeader,
  SeeYouThereCardMeta,
  SeeYouThereCardTitle,
} from './index'

const Pill = ({ width }: { width: string }) => (
  <span className={`block h-6 rounded-full bg-muted-foreground/20 ${width}`} />
)

const Bar = ({ height, width }: { height: string; width: string }) => (
  <span className={`block rounded bg-muted-foreground/25 ${height} ${width}`} />
)

const SeeYouThereCardSkeleton = () => (
  <SeeYouThereCard aria-hidden className="bg-muted text-transparent animate-pulse">
    <SeeYouThereCardHeader>
      <SeeYouThereCardBadges>
        <Pill width="w-16" />
        <Pill width="w-20" />
      </SeeYouThereCardBadges>
      <Pill width="w-16" />
    </SeeYouThereCardHeader>
    <SeeYouThereCardFooter>
      <SeeYouThereCardBody>
        <SeeYouThereCardTitle>
          <Bar height="h-6" width="w-2/3" />
        </SeeYouThereCardTitle>
        <SeeYouThereCardMeta>
          <Bar height="h-4" width="w-1/2" />
        </SeeYouThereCardMeta>
      </SeeYouThereCardBody>
    </SeeYouThereCardFooter>
  </SeeYouThereCard>
)

type GridProps = Pick<SeeYouThereGridProps, 'columns' | 'gap'> & {
  count: number
}

const SeeYouThereCardSkeletonGrid = ({ count, columns, gap }: GridProps) => (
  <SeeYouThereGrid columns={columns} gap={gap}>
    {Array.from({ length: count }, (_, i) => (
      <SeeYouThereCardSkeleton key={i} />
    ))}
  </SeeYouThereGrid>
)

export { SeeYouThereCardSkeleton, SeeYouThereCardSkeletonGrid }
