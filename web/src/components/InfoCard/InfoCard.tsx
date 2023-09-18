import { useState } from 'react'

import { fourHoursLater } from 'src/lib/dates'
import { useAuth } from 'src/auth'

import Button from 'src/components/Button/Button'
import PaperTitle from 'src/components/PaperTitle/PaperTitle'
import SceneDetails from 'src/components/SceneDetails/SceneDetails'
import RateScene from 'src/components/RateScene/RateScene'
import LiveTag from 'src/components/LiveTag/LiveTag'

import { Scene, User } from 'types/graphql'

enum ScreenProgress {
  OVERVIEW,
  RATE,
  DETAILS,
}

type SceneInfo = Pick<
  Scene,
  | 'id'
  | 'createdAt'
  | 'coverImageId'
  | 'latitude'
  | 'longitude'
  | 'title'
  | 'link'
  | 'info'
  | 'averages'
> & {
  user?: Pick<User, 'username' | 'avatar'> | null
}

const InfoCard = ({ scene }: { scene: SceneInfo }) => {
  const { isAuthenticated, logIn } = useAuth()
  const [screenProgress, setScreenProgress] = useState<ScreenProgress>(
    ScreenProgress.OVERVIEW
  )

  const { crowded, vibe, totalRatings } = scene.averages || {}

  return (
    <div className="relative w-full max-w-md animate-fade-in text-white shadow-lg">
      <div className="card-paper-shadow absolute inset-0 translate-x-[6px] translate-y-[7px] rotate-[.666deg] bg-neutral-300" />
      <div className="card-paper-shadow absolute inset-0 translate-x-[7.5px] translate-y-[7px] -rotate-[.9deg] bg-neutral-300" />

      <div className="relative bg-neutral-750">
        <div
          className="flex min-h-[250px] flex-col items-end justify-between gap-2 bg-cover bg-center p-3 text-xs font-normal"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, .0), rgba(0, 0, 0, .80)), url(https://res.cloudinary.com/infinity-keys/image/upload/c_fill,h_500,w_500/${scene.coverImageId})`,
          }}
        >
          <div className="px-4 text-center md:px-8">
            <PaperTitle text={scene.title} withAnimation />
          </div>

          <div className="flex w-full items-end justify-between">
            {scene.averages?.live && !fourHoursLater(scene.createdAt) && (
              <LiveTag />
            )}

            <div className="ml-auto">
              {typeof crowded === 'boolean' && (
                <div className="mb-4 flex items-center bg-black px-3 text-right">
                  <p className="rotate-[1.2deg] text-sm font-bold uppercase">
                    {crowded ? 'Packed place' : 'Kinda Empty'}
                  </p>
                  <p className="-translate-y-2 translate-x-4 text-2xl">
                    {crowded ? '🥳' : '🫥'}
                  </p>
                </div>
              )}

              {typeof vibe === 'boolean' && (
                <div className="flex items-center bg-black px-3 text-right">
                  <p className="-rotate-[1.8deg] text-sm font-bold uppercase">
                    {vibe ? 'Great show' : 'So so show'}
                  </p>
                  <p className="-translate-y-2 translate-x-4 text-2xl">
                    {vibe ? '🤩' : '😴'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          {screenProgress === ScreenProgress.OVERVIEW && (
            <>
              <div className="flex items-baseline gap-2">
                {totalRatings && totalRatings > 0 ? (
                  <p className="text-sm">
                    {scene.averages?.totalRatings}{' '}
                    {totalRatings > 1 ? 'ratings' : 'rating'}
                  </p>
                ) : null}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  fullWidth
                  onClick={() => setScreenProgress(ScreenProgress.DETAILS)}
                >
                  + INFO
                </Button>

                {isAuthenticated ? (
                  <Button
                    fullWidth
                    accent
                    onClick={() => setScreenProgress(ScreenProgress.RATE)}
                  >
                    Rate This Scene
                  </Button>
                ) : (
                  <Button accent fullWidth onClick={() => logIn()}>
                    Log in to Rate
                  </Button>
                )}
              </div>
            </>
          )}

          {screenProgress === ScreenProgress.RATE && (
            <RateScene
              sceneId={scene.id}
              previous={() => setScreenProgress(ScreenProgress.OVERVIEW)}
              onRateSuccess={() => setScreenProgress(ScreenProgress.OVERVIEW)}
            />
          )}

          {screenProgress === ScreenProgress.DETAILS && (
            <SceneDetails
              scene={scene}
              previous={() => setScreenProgress(ScreenProgress.OVERVIEW)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoCard
