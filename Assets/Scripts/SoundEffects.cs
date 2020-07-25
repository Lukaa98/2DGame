using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SoundEffects : MonoBehaviour
{
   public AudioSource levelMusic;
   public AudioSource deathSong; 
   public AudioSource wonSong; 

   public AudioSource stretch;
   public AudioSource birdfly;

    


   public bool Stretch = false;
   public bool Birdfly = false;


   public bool levelSong = true;
   public bool DeathSong = false;
   public bool WonSong = false;

   

   
        public void FlySound()
    {
        if(stretch.isPlaying)
        Stretch = false;
        {
            stretch.Stop();
        }
            if(!birdfly.isPlaying && Birdfly == false)
            {

                Birdfly = true;
                birdfly.Play();

            }
        }


        public void StretchSound()
    {
        if(birdfly.isPlaying)
        Birdfly = false;
        {
            birdfly.Stop();
        }
            if(!stretch.isPlaying && Stretch == false)
            {

                Stretch = true;
                stretch.Play();

            }
        }



   
    public void LevelMusic()
    {
        levelSong = true;
        DeathSong = false;
        WonSong = false;
        levelMusic.Play();
    }

    public void DeathSound()
    {
        if(levelMusic.isPlaying)
        levelSong = false;
        {
            levelMusic.Stop();
        }
            if(!deathSong.isPlaying && DeathSong == false)
            {

                DeathSong = true;
                deathSong.Play();

            }
        }


        public void WonSound()
    {
        if(levelMusic.isPlaying)
        levelSong = false;
        {
            levelMusic.Stop();
        }
            if(!wonSong.isPlaying && WonSong == false)
            {

                WonSong = true;
                wonSong.Play();

            }
        }
      }

    


