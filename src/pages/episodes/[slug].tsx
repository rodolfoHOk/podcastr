import styles from './episodes.module.scss';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
  duration: number;
  durationAsString: string;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps){
  /* somente em fallback true no getStaticPaths
  const router = useRouter();
  if (router.isFallback) {
    return <p>Carregando...</p>
  } */

  return (
    <div className={styles.scroll}>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar"/>
            </button>
          </Link>
          <Image 
            width={700}
            height={450}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit="contain"  
          />
          <button type="button">
            <img src="/play.svg" alt="Tocar episódio"/>
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div 
          className={styles.description} 
          dangerouslySetInnerHTML={{ __html: episode.description}}
        />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const paths = data.map(episode => {
    return {
      params: { 
        slug: episode.id
      }
    }
  });

  return {
    paths,
    fallback: 'blocking'
  }
}
/*
  getStaticPaths é necessário quando temos o getStaticProps e a página é dinâmica. No caso [slug].
  paths: [{ params: { xyz: }}] -> para informar as páginas que serão geradas estáticamente no build.
  fallback: 'string' -> se false: retorna 404 nas páginas não geradas estaticamente.
  -> se true: roda a requisição dos dados das páginas no lado do client(browser).
  Nesta opção é preciso inserir if (router.isFallback) para aguardar os dados e não renderizar a página.
  -> se blocking: roda a requisição dos dados das páginas no servidor do Next (NodeJs server).
  Nesta opção as páginas que não foram informadas no paths serão geradas no primeiro acesso 
  e após o período de revalidação no acesso primeiro acesso seguinte ao período.
*/

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params; 
  
  const { data } = await api.get(`/episodes/${slug}`);
  
  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR}),
    thumbnail: data.thumbnail,
    description: data.description,
    url: data.file.url,
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration))
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
