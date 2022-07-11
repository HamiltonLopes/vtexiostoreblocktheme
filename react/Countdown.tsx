import React, {useState} from 'react';
import { TimeSplit } from './typings/global';
import {tick, getTwoDaysFromNow} from './utils/time';
import {useCssHandles} from 'vtex.css-handles';
import { useQuery } from 'react-apollo';
import useProduct from 'vtex.product-context/useProduct';
import productReleaseDate from './queries/productReleaseDate.graphql';

interface CountdownProps {
  targetDate: string
}
const CSS_HANDLES = ["countdown"];
const DEFAULT_TARGET_DATE = getTwoDaysFromNow();
const Countdown: StorefrontFunctionComponent<CountdownProps> = _ => {

  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const {product} = useProduct();

  if (!product) {
    {
      <div>
        <span>There is no product context.</span>
      </div>
    }
  }

  const {data, loading, error} = useQuery(productReleaseDate, {
    variables: {
      slug: product?.linkText
    },
    ssr:false
  });

  if (loading) {
    {
      <div>
        <span>Loading...</span>
      </div>
    }
  }

  if (error) {
    {
      <div>
        <span>Erro!</span>
      </div>
    }
  }

  console.log({data})
  

  const handles = useCssHandles(CSS_HANDLES);

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime);

  return (
      <div className={`${handles.countdown} t-heading-2 fw3 w-100 c-muted-1 db tc`}>
        {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
      </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate:{
      title: "Data final",
      description:"Data final utilizada no contador",
      type: "string",
      default: null
    }
  },
}

export default Countdown
